# Stripe Integration Setup Guide

This guide will walk you through setting up Stripe for the ResumeTailor SaaS subscription system.

## Prerequisites

- A Stripe account (sign up at https://stripe.com)
- Access to your Stripe Dashboard

## Step 1: Get Your Stripe Secret Key

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Click on **Developers** in the left sidebar
3. Click on **API keys**
4. Copy your **Secret key** (starts with `sk_test_` for test mode)
5. Add it to your `.env` file:
   ```
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
   ```

**Important:** Never commit your secret key to version control. Always use environment variables.

## Step 2: Create a Pro Plan Product

1. In the Stripe Dashboard, go to **Products**
2. Click **+ Add product**
3. Fill in the product details:
   - **Name:** ResumeTailor Pro
   - **Description:** Pro plan with 50 ATS checks/month, 30 AI tailoring sessions, unlimited resumes & portfolios
4. Under **Pricing:**
   - **Price:** $9.99
   - **Billing period:** Monthly (recurring)
   - Click **Add pricing**
5. Click **Save product**
6. After creating, click on the price you just created
7. Copy the **Price ID** (starts with `price_`)
8. Add it to your `.env` file:
   ```
   NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_your_actual_price_id
   ```

## Step 3: Set Up Webhook Endpoint

Webhooks allow Stripe to notify your application when subscription events occur (upgrades, cancellations, payment failures).

### For Local Development (using Stripe CLI)

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Other platforms: https://stripe.com/docs/stripe-cli#install
   ```

2. Log in to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhook events to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. The CLI will output a webhook signing secret (starts with `whsec_`). Copy it and add to `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
   ```

5. Keep the `stripe listen` command running in a terminal while testing locally

### For Production

1. In the Stripe Dashboard, go to **Developers** > **Webhooks**
2. Click **+ Add endpoint**
3. Set the **Endpoint URL** to: `https://yourdomain.com/api/stripe/webhook`
4. Under **Events to send**, select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Click on your newly created webhook endpoint
7. Click **Reveal** under **Signing secret**
8. Copy the signing secret and add it to your production environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
   ```

## Step 4: Test the Integration

### Test Upgrade Flow

1. Start your development server:
   ```bash
   npm run dev
   ```

2. In another terminal, start Stripe webhook forwarding:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. Log in to your application and navigate to `/dashboard/billing`

4. Click **Upgrade to Pro**

5. Use Stripe's test card numbers:
   - **Successful payment:** `4242 4242 4242 4242`
   - **Any future expiry date (e.g., 12/34)**
   - **Any 3-digit CVC**
   - **Any 5-digit ZIP code**

6. Complete the checkout

7. You should be redirected back to the billing page with Pro status

### Test Webhook Events

After completing a test checkout, check your terminal running `stripe listen`. You should see webhook events being received and processed.

### Verify Database Updates

After upgrading, check your MongoDB database:

```javascript
// In MongoDB shell or Compass
db.subscriptions.findOne({ userId: 'your-user-id' })
```

You should see:
- `plan: 'pro'`
- `status: 'active'`
- `stripeCustomerId` populated
- `stripeSubscriptionId` populated

## Step 5: Test Subscription Limits

### Free Plan Limits
- 3 ATS checks per month
- 2 AI tailoring sessions per month
- 2 resumes
- 1 portfolio

### Pro Plan Limits
- 50 ATS checks per month
- 30 AI tailoring sessions per month
- 20 resumes
- 10 portfolios

**Test the flow:**

1. Create a free account
2. Try to use ATS checker multiple times - you should hit the limit after 3 uses
3. You should see an upgrade prompt dialog
4. Upgrade to Pro via billing page
5. Try ATS checker again - should work up to 50 times

## Step 6: Production Checklist

Before going live:

- [ ] Switch from test mode to live mode in Stripe Dashboard
- [ ] Update `STRIPE_SECRET_KEY` to live key (starts with `sk_live_`)
- [ ] Create production webhook endpoint
- [ ] Update `STRIPE_WEBHOOK_SECRET` to production webhook secret
- [ ] Update `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` to production price ID
- [ ] Test a real (small amount) payment to verify everything works
- [ ] Set up Stripe billing portal settings in Dashboard > Settings > Billing
- [ ] Enable invoice emails in Stripe Dashboard
- [ ] Configure tax settings if applicable

## Troubleshooting

### Webhook Signature Verification Failed

- Make sure `STRIPE_WEBHOOK_SECRET` matches your endpoint's secret
- For local development, ensure `stripe listen` is running
- Check that you're using the correct secret (test vs production)

### Checkout Session Not Completing

- Verify `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` is correct
- Check browser console for errors
- Ensure success/cancel URLs are correct in `create-checkout-session/route.ts`

### Subscription Not Updating in Database

- Check webhook logs in Stripe Dashboard (Developers > Webhooks > click endpoint > View logs)
- Verify MongoDB connection is working
- Check server logs for database errors
- Ensure user has a valid `userId` in the session

### Usage Limits Not Resetting

Usage limits automatically reset monthly based on the `lastResetDate` field in the subscription document. The reset logic runs every time `getUserSubscription()` is called.

If limits aren't resetting:
- Check the `lastResetDate` value in MongoDB
- Verify the date comparison logic in `lib/subscription.ts`
- Manually trigger a reset by updating `lastResetDate` to a date 31+ days ago

## Useful Stripe Test Cards

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 0002 | Card declined |
| 4000 0000 0000 9995 | Insufficient funds |
| 4000 0025 0000 3155 | Requires authentication (3D Secure) |

Full list: https://stripe.com/docs/testing#cards

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe CLI Reference](https://stripe.com/docs/cli)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

## Security Best Practices

1. **Never expose secret keys** - Only use them server-side
2. **Always verify webhook signatures** - Already implemented in `webhook/route.ts`
3. **Use HTTPS in production** - Required for live mode
4. **Validate user permissions** - Already implemented with session checks
5. **Log webhook events** - Consider adding logging for audit trails
6. **Handle failed payments gracefully** - Already handled with `invoice.payment_failed` event
