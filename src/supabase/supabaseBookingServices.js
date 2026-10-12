// supabaseBookingService.js

import { supabase } from "./supabaseClient";

export async function getBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true });
  if (error) throw error;
  return data.map((booking) => ({
    ...booking,
    date: booking.booking_date,
    time: booking.booking_time,
    clientName: booking.name,
    email: booking.email,
    number: booking.contact_number,
    message: booking.message,
    status: booking.status || "Очікується",
  }));;
}

export async function saveBooking(booking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        date: booking.date,
        time: booking.time,
        clientName: booking.clientName,
        email: booking.email,
        number: booking.contact_number,
        message: booking.message,
        status: booking.status || "Очікується",
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBooking(id) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw error;
}

export async function updateBookingStatus(id, status) {
  console.log("Updating booking ID:", id, "to status:", status);
  const { data, error } = await supabase

    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}


export function onBookingsChange(cb) {
  const channel = supabase
    .channel("bookings-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookings",
      },
      cb,
    )
    .subscribe((status) => {
      console.log("Bookings realtime status:", status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}




