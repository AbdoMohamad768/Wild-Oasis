import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router-dom";

export function useBooking() {
  const { bookingID } = useParams();

  const { isLoading, data: booking } = useQuery({
    queryKey: ["bookings", bookingID],
    queryFn: () => getBooking(bookingID),
    retry: false,
  });

  return { isLoading, booking };
}
