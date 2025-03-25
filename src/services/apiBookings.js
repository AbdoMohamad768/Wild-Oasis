import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

export async function getBookings({ filter, sort, page }) {
  let query = supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice, isPaid, hasBreakfast, observations, cabins(*), guests(*)",
      { count: "exact" }
    );

  // Filter
  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  // Sort
  if (sort)
    query = query.order(sort.field, { ascending: sort.direction === "asc" });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error && error.code !== "PGRST103") {
    console.error(error.message);
    throw new Error("Booking not found");
  }

  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
// date: ISOString
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error.message);
    throw new Error("Booking could not be updated");
  }

  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error.message);
    throw new Error("Booking could not be deleted");
  }

  return data;
}

export async function createEditBooking(newBooking, id) {
  const {
    data: { regularPrice, discount },
    error: cabinError,
  } = await supabase
    .from("cabins")
    .select()
    .eq("id", newBooking.cabinID)
    .single();

  if (cabinError) throw new Error(cabinError.message);

  const {
    data: { breakfastPrice },
    error: settingsError,
  } = await supabase.from("settings").select().single();

  if (settingsError) throw new Error(settingsError.message);

  let query = supabase.from("bookings");

  if (id) query = query.update(newBooking).eq("id", id);

  newBooking.extrasPrice = newBooking.hasBreakfast
    ? breakfastPrice * newBooking.numNights * newBooking.numGuests
    : 0;

  newBooking.cabinPrice = (regularPrice - discount) * newBooking.numNights;
  newBooking.totalPrice = newBooking.cabinPrice + newBooking.extrasPrice;

  if (!id) {
    query = query.insert([newBooking]);
  }

  const { data, error } = await query.select().single();

  if (error) throw new Error(error.message);

  return data;
}
