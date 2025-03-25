import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useEditBooking() {
  const queryClient = useQueryClient();

  const { mutate: editBooking, isLoading: isEditingBooking } = useMutation({
    mutationFn: ({ bookingToEdit, id }) => createEditBooking(bookingToEdit, id),
    onSuccess: () => {
      toast.success("Booking Edited Successfully");

      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { editBooking, isEditingBooking };
}
