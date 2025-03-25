import supabase from "./supabase";

export async function getGuests() {
  const { data, error } = await supabase.from("guests").select("*");

  if (error) throw new Error(error.message);

  return data;
}

export async function createGuest(newGuest) {
  const { data, error } = await supabase
    .from("guests")
    .insert([newGuest])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}
