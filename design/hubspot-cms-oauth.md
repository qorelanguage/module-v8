# HubSpot CMS authorization

Copyright 2026 Qore Technologies, s.r.o.

The HubSpot TypeScript app defines `content cms.domains.read` in
`rest.oauth2_auth_args.optional_scope`. `TypeScriptActionInterface` carries that
existing option into the connection schema and defaults. `RestConnection`
generates the encoded consent URL, including the separate required `scope`,
optional `optional_scope`, redirect URI and state parameters.

`TypeScriptAppRestConnection.getImpl()` selects `TypeScriptHubspotRestClient` for
the HubSpot app. The generic API action obtains this client from the connection.
Its request signing hook checks supported page/domain paths after the base client
refreshes authentication, and again if authentication is retried. It introspects
the outgoing bearer token through the generic
`TypeScriptAppRestClient.introspectOAuth2Token()` API, supplying the configured
provider token URL plus `/introspect`. This API uses a separate client for direct
credential-based requests or signed requests through `oauth2_alt_token_url`.
The hosting application supplies that alternate endpoint and signer; opaque
`oauth2_token_args` carry routing context. The module implements no service-specific
credential resolution or signing algorithm. The
[generic API contract](../docs/oauth2-token-introspection.md) defines the operation
fields, authentication options and failure behavior.
There is no mutable grant cache or persisted scope snapshot.
The active token and granted scope list must be valid; requested scopes and ping
results are never permission evidence. CRM requests skip introspection.

The common synchronous send/response path translates CMS 403 responses into a
capability error with account entitlement and reauthorization guidance. Missing
grants and metadata failures are rejected before sending the CMS operation.
Introspection failures discard their original payloads to avoid propagating
credentials. Raw and bounded requests use these same hooks.

TypeScript REST clients override `copySelf()` because their constructor needs the
owning connection as well as REST options. Copies retain their concrete class,
connection, current token, alternate endpoint signer/header and any custom behavior.
Introspection never runs the token exchange/persistence path, even if the metadata
service returns an unexpected token response. Unsupported operations fail without
direct fallback; the CMS checker requires active-token metadata and granted scopes.

Credential storage and consent callbacks belong to the consuming application.
This module does not replace credentials to enable optional scopes. The
[deployment guide](../docs/hubspot-cms-oauth.md) describes staging a candidate,
validating it and committing its options before switching the active connection.
`test/hubspot-oauth.qtest` exercises the real TypeScript metadata and Qore
connection against loopback fixtures; it requires no production account.
