# NimbusMart — confirmed implementation brief

Status: requirements and design decisions only. No NimbusMart source changes or migration are included in this portfolio package.

## Owner's confirmed decisions

India-focused demonstration store, INR prices, and no paid hosting or services. Existing production data is to be preserved by default. Payments and fulfilment remain simulated; do not collect real card details or initiate real UPI transactions.

## INR and India localisation

Create an India-specific sample catalogue rather than replacing the dollar symbol on the existing dollar amounts. Label catalogue prices as illustrative demo prices, not verified market quotations. Use Indian currency formatting and integer paise for new monetary calculations. Update category thresholds, price filters, promotional artwork and order summaries together.

Add India-appropriate address fields, state/union-territory selection and six-digit PIN validation. Do not imply that format validation confirms serviceability. Replace the arbitrary 8% tax calculation with explicitly described demo pricing; do not invent a uniform GST rate or advertise a legally compliant tax invoice.

Implement a single server-authoritative price and delivery calculation. In the initial demo version use consistent free simulated delivery throughout, with no shipping/refund promises suggesting that real goods are being sold.

Preserve legacy USD products and order amounts with explicit currency metadata. Any migration must back up existing records, identify schema versions and be idempotent. Historical USD totals must not be silently interpreted as INR or rewritten as new prices. Retain order-line price snapshots and currency.

## Free hosting direction

Keep the existing Render free web service for the demonstration and use an external durable database rather than local SQLite as the production source of truth. Turso's current free plan is a candidate because it offers hosted SQLite-compatible storage without a paid plan.

This requires a real database-client integration; setting a database URL alone will not make the current synchronous better-sqlite3 application work with a remote service. Adapt the data-access paths, preserve transaction/stock guarantees, and test the selected remote engine before deployment. Do not silently fall back to ephemeral local storage in production.

The user-owned database URL and authentication token must be entered in the hosting environment, not sent in chat or committed to Git. No provider account was created and no hosting settings were changed in this session. Free services have quotas and availability limits; do not activate automatic paid upgrades. Monitor usage and configure zero-spend controls where supported.

Current official references checked on 8 September 2026:
- Render free service limitations: https://render.com/docs/free
- Turso pricing: https://turso.tech/pricing

Render documents the loss of local filesystem changes on redeploy, restart or idle spin-down. Its free Postgres instances expire after 30 days, so they are not the recommended durable long-term demo database. Turso currently advertises a $0 tier with no credit card required. Provider terms may change; verify again at deployment.

## Functional work still required

1. Separate guest/account carts, isolate account changes, serialize synchronization and show sync failures.
2. Add idempotent order creation, explicit order-status transitions and tests for stock restoration.
3. Make Buy now use a distinct immediate-purchase checkout or explicitly relabel the existing behaviour.
4. Remove real-card collection, unsupported return promises and unlabeled seeded ratings.
5. Derive homepage selections from category/price rules; use Top rated rather than Best sellers unless sales are actually measured.
6. Preserve filters and sorting in the URL; prevent stale search suggestions and support keyboard navigation.
7. Complete mobile-dialog focus handling, responsive visual checks and meaningful loading/error states.
8. Fail closed when production secrets or durable storage configuration are missing.

## Release gates

No production reset. No tests using real customer/payment information. Back up first, test migrations on a copy, test two-account isolation and order retries, verify persistence across redeployment, then review a preview before changing the live service.
