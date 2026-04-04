-- Migration: Add payment_status and payment_id columns to orders table
-- Run this in Supabase SQL Editor before using Razorpay payments

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_id text;
