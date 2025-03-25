import { useMutation } from "@tanstack/react-query";
import { signUp as signUpAPI } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignUp() {
  const { mutate: signUp, isLoading: isSigningUp } = useMutation({
    mutationFn: ({ fullName, email, password }) =>
      signUpAPI({ fullName, email, password }),
    onSuccess: (user) => {
      toast.success(
        "Account successfully created! Please verify the new account from the user's email address"
      );
    },
    onError: (err) => {
      console.error(err.message);

      toast.error("Something went wrong while creating the new account");
    },
  });

  return { signUp, isSigningUp };
}
