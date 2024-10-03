export const STRIPE_APP_NAME = 'Stripe';
export const STRIPE_ALLOWED_PATHS = [
  '/v1/account',
  '/v1/balance',
  '/v1/balance/history',
  '/v1/balance/history/{id}',
  '/v1/charges',
  '/v1/charges/{charge}',
  '/v1/customers',
  '/v1/customers/{customer}',
  '/v1/customers/{customer}/balance_transactions',
  '/v1/customers/{customer}/sources',
  '/v1/customers/{customer}/subscriptions',
  '/v1/invoices',
  '/v1/invoices/{invoice}',
  '/v1/payment_intents',
  '/v1/refunds',
];
