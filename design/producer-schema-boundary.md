# TypeScript provider schema boundary

TypeScript app and action records cross an untyped JavaScript-to-Qore boundary. `TypeScriptActionInterface` owns the
single normalization point for that boundary; downstream registration code consumes canonical Qore metadata and must
not repeat structural guesses.

## Version contract

Apps and actions may declare `provider_schema_version`. An absent member means version 1 for backward compatibility.
An explicit member must be the integer `1`; null, an empty value, another type, and unsupported integers fail before
schema materialization. The boundary removes the member after validation so it never leaks into provider metadata.

Adding or changing producer structure requires a new version and an explicit compatibility branch here. Do not infer a
version from labels, optional members, or JavaScript object shape.

## Allowed values

Only the declared `allowed_values` and `element_allowed_values` positions are converted to `AllowedValueInfo`. The
member must be a list, including an explicitly empty list. Each entry must be a hash with its own exact `value` member.
The value itself is opaque and may be a scalar, list, or hash—including a hash that also contains a member named
`value`. Null is not absence and fails validation.

This structural placement rule prevents a recursive "hash containing value" heuristic from reclassifying application
payloads as presentation metadata.

## Discovery inventory

The TypeScript catalogue publishes the complete app/action identity batch for each app before invoking its first Qore
schema conversion. The inventory contains no action schemas and is exposed through `getDiscoveryInventory()`.
Each batch describes exactly one app, includes its app identity, and atomically replaces that app's previous action
set; dynamic replacement preserves the new batch while removing the old runtime registration.
Per-record registration also records its identity as a backward-compatible fallback for older catalogue scripts and
direct dynamic calls. A one-shot batch marker pairs the complete batch with its app registration; an older script
that does not publish a batch clears the previous replacement inventory and rebuilds it per record, rather than
mistaking stale action identities for a current complete set. Module initialization registers the inventory callback
with `DataProviderActionCatalog`; a
qualified `ProviderIndex` generation collects it after TypeScript sources load. A malformed earlier record therefore
cannot hide later action identities behind the first conversion failure.
Every exact identity addition/removal advances Qore's producer-inventory revision, so collection cannot race a
producer mutation and then certify the newer catalog against an older expected set. Filtered index builds collect only
identities in their requested app scope.

The inventory mutation and `DataProviderActionCatalog::markDiscoveryInventoryChanged()` call occur in the same
`discovery_inventory_lock` interval. Collection snapshots Qore's inventory revision without that lock, invokes the
producer callback outside Qore's catalog lock, and then rechecks the revision. This lock ordering makes the producer
state/revision pair linearizable without ever nesting the producer lock below the catalog lock; a collector sees the
old pair, the new pair, or a stale revision that cannot qualify.

Failures are retained at the earliest boundary that has a valid technical identity, including JavaScript pool lookup,
JavaScript-to-Qore conversion, and validation before catalog materialization. Deregistration removes inventory and
retained failure state even when no catalog app was created, so failed dynamic registrations do not leak identities.
A catalogue load or invocation failure that occurs before any valid record identity is retained against its exact
source. The inventory callback raises a structured source error until that same source loads successfully, preventing
an API-version mismatch or broken master script from masquerading as a valid empty inventory.

Consequences:

- an action that fails schema conversion remains expected and makes index qualification fail;
- a source that fails before publishing identities makes inventory collection fail;
- a successful retry satisfies the same exact identity;
- dynamic app deregistration removes its inventory contribution;
- inventory collection adds no work to action execution.

## Static presentation view

A TypeScript field can carry a context-dependent `dynamic_type` or default-value callback. Catalog extraction must
not execute either: it has no connection context, and the same source revision must always produce the same root
catalog. `TypeScriptDataField::getDeclaredType()` therefore returns the static fallback type directly while
`AbstractDataField::getPresentationInfo()` exposes only static labels and choices. Runtime schema resolution continues
to use `getType()` and is unchanged.

Compound types constructed at this boundary retain a stable technical path
rooted at the exact app/action role (request, response, event, or option).
Each dynamic component is a typed base64url-encoded segment; punctuation in a flat identifier therefore cannot
collide with a structurally nested path (for example, field `a-b` is distinct from fields `a` then `b`).
Presentation extraction uses the path to disambiguate equal-shaped anonymous
schemas without hashing translated prose. Any adapter adding another compound
schema entry point must assign an equally stable path before publication.

## Change checklist

When changing the producer boundary:

1. update the version contract if the accepted wire structure changes;
2. normalize only at the named structural position;
3. test absent, empty, null, malformed, supported-version, and unsupported-version inputs;
4. include an opaque payload hash containing `value` and a serialization round trip;
5. verify the complete app/action batch is published before registration and a failed action remains in the
   lightweight discovery inventory;
6. verify catalog extraction does not invoke dynamic type/default/example callbacks;
7. build the AOT qmod against the matching Qore `DataProvider` version and run normal, AST, and AOT test modes.

Release CI then runs `test/docker_test/qualify-provider-discovery.q` against the installed module set, with ambient
`QORE_DATA_PROVIDERS` source discovery disabled. Before opening a qualification generation, the script selects the
same eager-discovery options as `ProviderIndex`, loads `TypeScriptActionInterface` inside the structured error
boundary, completes its static initializer, and dynamically verifies that the exact TypeScript inventory is non-empty
before ProviderIndex can publish. After ProviderIndex returns, the script verifies that the qualified app/action sets
are non-empty. An incompatible installed Qore/module pair therefore
cannot regress to a generic index that reports success with zero TypeScript providers. The script writes the
complete structured discovery report together with the source revision and qore-test-base build provenance as a CI
artifact. A failed generation writes its structured exception report before failing the job; logs are never used as
the qualification signal.
