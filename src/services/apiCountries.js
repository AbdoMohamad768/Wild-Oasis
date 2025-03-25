export async function apiCountries() {
  try {
    const res = await fetch("https://flagcdn.com/en/codes.json");

    const data = await res.json();

    return data;
  } catch (error) {
    // console.error(error.message);
    throw new Error(error.message);
  }
}
