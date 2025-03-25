import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  const {
    mutate: createBooking,
    isLoading: isCreatingBooking,
    error,
  } = useMutation({
    mutationFn: (newBooking) => createEditBooking(newBooking),
    onSuccess: (data) => {
      toast.success("Booking created successfully");

      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createBooking, isCreatingBooking, error };
}
