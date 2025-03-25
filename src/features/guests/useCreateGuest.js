import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createGuest as createGuestAPI } from "../../services/apiGuests";

export function useCreateGuest() {
  const queryClient = useQueryClient();

  const { mutate: createGuest, isLoading: isCreatingGuest } = useMutation({
    mutationFn: (newGuest) => createGuestAPI(newGuest),
    onSuccess: () => {
      toast.success("New guest created successfully");

      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createGuest, isCreatingGuest };
}
