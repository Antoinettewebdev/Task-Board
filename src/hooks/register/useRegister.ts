import { useMutation } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import type { RegisterFormType } from "@/type/RegisterFormType";

export function useRegister(
  onSuccess: () => void,
  onError?: (message: string) => void
) {
  return useMutation({
    mutationFn: async ({ email, password, confirmPassword }: RegisterFormType) => {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      return await pb.collection("users").create({
        email,
        password,
        confirmPassword,
      });
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: unknown) => {
      let message = "Registration failed. Please try again.";
      if (error instanceof Error && error.message) {
        message = error.message;
      }
      onError?.(message);
    },
  });
}