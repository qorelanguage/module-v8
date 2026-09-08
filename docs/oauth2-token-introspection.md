# OAuth2 token introspection

Copyright 2026 Qore Technologies, s.r.o.

`TypeScriptAppRestClient.introspectOAuth2Token(introspection_url, token)` retrieves
metadata for the supplied access token. The provider endpoint is an explicit
argument: the generic API makes no assumptions about provider URL layouts or
scope formats. It returns the response object for the caller to validate.

```qore
TypeScriptAppRestClient client = cast<TypeScriptAppRestClient>(connection.get(False));
hash<auto> metadata = client.introspectOAuth2Token(
    "https://provider.example.test/oauth/introspect", client.getToken());
```

The method uses a separate synchronous REST client with form encoding, certificate
verification, the caller's connection/request timeouts, and redirects disabled.
It has no logger or token persistence callbacks. It does not authenticate or
refresh the owning client, change its URL, or replace its tokens. Transport,
signing, malformed response, and configuration failures produce a sanitized
`OAUTH2-INTROSPECTION-ERROR` without request or response data. The supplied signer
is responsible for keeping its own logging free of credentials.

## Direct requests

When `oauth2_alt_token_url` is absent, the method posts `client_id`,
`client_secret`, `token`, and `token_type_hint=access_token` to the supplied
introspection URL. Credentials come from the connection's OAuth2 options.
`oauth2_token_use_basic_auth` moves client authentication to HTTP Basic, encoding
the client ID and secret individually before joining them as required by
[OAuth2 client authentication](https://www.rfc-editor.org/rfc/rfc6749.html#section-2.3.1);
`oauth2_token_auth_secret_only` uses the existing secret-only Basic convention.
Both options follow the token endpoint authentication configuration.

## Delegated requests

When `oauth2_alt_token_url` is configured, that service must implement this
introspection contract. Configure its request signer through the existing
`RestConnection.setAltTokenSigner()` or `RestClient.setAltTokenSigner()` API:

```qore
connection.setAltTokenSigner(signer, "X-OAuth-Signature");
```

The hosting application supplies the endpoint, signer and signature header name.
The module contains no service URLs, signing keys, application registry names,
or special credential markers. Configuring the alternate endpoint selects
delegation even if a local client secret is also available. Missing signing
configuration fails before sending. Copied TypeScript REST clients retain their
signer and header for both token refresh and introspection.
Complete endpoint and signing configuration before using or copying clients;
do not reconfigure them while requests or copies are in progress. A signer shared
by clients used concurrently must be thread safe. Introspection request state is
local to each call; no shared metadata cache is created.

The request is a form-encoded POST to `oauth2_alt_token_url`. These are its decoded
fields; the `tenant` field illustrates opaque context supplied in
`oauth2_token_args`:

```json
{
  "tenant": "example-tenant",
  "oauth2_operation": "introspect",
  "oauth2_token_url": "https://provider.example.test/oauth/introspect",
  "client_id": "example-client",
  "token": "<access token being checked>",
  "token_type_hint": "access_token"
}
```

`oauth2_token_url` is the full provider **introspection** URL for this operation.
The existing REST signing mechanism supplies the callback with the prepared
request path, serialized body, and headers and writes its result to the configured
signature header. The module does not implement a signature algorithm.

Opaque token arguments are forwarded except `client_secret`, `grant_type`,
`code`, `redirect_uri`, `refresh_token`, `code_verifier`, `username`, `password`,
`assertion`, `client_assertion`, and `client_assertion_type`. The five explicit
operation fields above override conflicting extra arguments. No client secret
is added, and no bearer authorization header is sent to the alternate service.

The service authenticates the request, resolves the client credentials from its
own configuration, validates the allowed upstream introspection endpoint, and
performs the provider request. It returns the metadata object directly, without
a token-exchange response wrapper. For example, HubSpot's CMS checker expects:

```json
{"active": true, "scopes": ["oauth", "content", "cms.domains.read"]}
```

Other providers may use different metadata fields. The generic API only requires
an object; activity, scope and entitlement decisions belong to the caller.

Deploy service support before enabling operations that require introspection.
An unsupported service operation fails without falling back to a direct request
or treating the response as new credentials. Existing token exchange and refresh
requests do not acquire an `oauth2_operation` field from this API and retain their
existing behavior. Callers that do not request introspection remain unaffected.

## Verification

`test/hubspot-oauth.qtest` exercises the generic client independently of the
HubSpot subclass and integrates it with the CMS checker. It covers form and Basic
authentication (including reserved and non-ASCII credential characters), a signed
alternate endpoint with arbitrary routing context,
credential-field filtering, redirects, missing/invalid/throwing signers, malformed
metadata, unsupported operations, token-state preservation, copied clients,
refresh, and authentication retries. See the
[fixture commands](hubspot-cms-oauth.md#local-verification).
