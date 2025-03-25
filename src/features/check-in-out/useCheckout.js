import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: (bookingID) =>
      updateBooking(bookingID, {
        status: "checked-out",
      }),
    onSuccess: () => {
      toast.success(`Booking successfully checked out`);
      queryClient.invalidateQueries({ active: true });
    },
    onError: () => {
      toast.error(`There was an error while checking out`);
    },
  });

  return { checkout, isCheckingOut };
}
