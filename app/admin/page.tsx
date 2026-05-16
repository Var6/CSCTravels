import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Booking } from '@/types/booking';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <AdminDashboard
      initialBookings={(bookings as Booking[]) || []}
      loadError={error?.message || null}
      userEmail={user?.email || ''}
    />
  );
}
