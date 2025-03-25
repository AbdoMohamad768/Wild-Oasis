import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout as logoutAPI } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutAPI,
    onSuccess: (user) => {
      navigate("/login", { replace: true });

      queryClient.removeQueries();

      toast.success(`Logged out successfully`);
    },
    // onError: (err) => {
    //   console.error(err.message);

    //   toast.error("Error occured while logging out");
    // },
  });

  return { logout, isLoading };
}
