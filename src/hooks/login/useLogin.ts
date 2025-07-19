import { useMutation } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";
import type { LoginFormValues } from "@/type/LoginTypes";

export function useLogin(
  onSuccess: () => void,
  onError?: (message: string) => void
) {
  return useMutation({
    mutationFn: async ({ email, password }: LoginFormValues) => {
      return await pb.collection("users").authWithPassword(email, password);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: unknown) => {
      if (onError) {
        const message =
          error instanceof Error ? error.message : "An unknown error occurred";
        onError(message);
      }
    },
  });
}
