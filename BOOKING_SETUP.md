# Booking System Setup

The site now accepts bookings online (`/Booking`) and has an admin dashboard (`/admin`) backed by Supabase. Follow these steps once to get it working.

## 1. Create a Supabase project

1. Go to https://supabase.com and create a free project.
2. Wait for it to finish provisioning.
3. Open **Project Settings → API**. You will need:
   - **Project URL** (e.g. `https://abcd1234.supabase.co`)
   - **anon public** key

## 2. Run the database migration

In the Supabase dashboard:

1. Open **SQL Editor → New query**.
2. Paste the contents of [`supabase/migrations/001_bookings.sql`](supabase/migrations/001_bookings.sql).
3. Click **Run**.

This creates the `bookings` table and sets up Row Level Security so:
- Anyone can create a booking (insert).
- Only logged-in users (admins) can read or update bookings.

## 3. Create your admin user

In the Supabase dashboard:

1. Go to **Authentication → Users → Add user → Create new user**.
2. Enter the admin email and a strong password. Tick **Auto Confirm User**.
3. (Optional) Turn off public sign-ups: **Authentication → Providers → Email → disable "Enable sign ups"**.

## 4. Set environment variables locally

Create `.env.local` in the project root (the file is git-ignored):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Then restart the dev server (`npm run dev`).

## 5. Set the same env vars on Vercel

In the Vercel dashboard → **Project → Settings → Environment Variables**, add the same two keys for **Production**, **Preview**, and **Development**. Redeploy.

## 6. Try it out

- Visit `/Booking`, submit a test booking.
- Visit `/admin` → sign in with the admin user you created → you should see the booking, and be able to mark it Confirmed / Completed / Cancelled.

## Notes

- The booking form also opens a pre-filled WhatsApp message to `+91 98731 01537` after submit, so you get an instant ping.
- To add more admins, just create more users in **Authentication → Users**.
- All booking writes go through `/api/bookings`; updates require an authenticated session.
