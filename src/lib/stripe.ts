import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
});

export const GUIDE_PLAN_PRICE_ID = process.env.STRIPE_GUIDE_PLAN_PRICE_ID!;
