import { useMutation } from "@tanstack/react-query";
import { pb } from "@/lib/pocketbase";

export function useGoogleRegister(
  onSuccess: () => void,
  onError?: (message: string) => void
) {
  return useMutation({
    mutationFn: async () => {
      return await pb
        .collection("users")
        .authWithOAuth2({ provider: "google" });
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: unknown) => {
      let message = "Google registration failed. Please try again.";
      if (error instanceof Error && error.message) {
        message = error.message;
      }
      onError?.(message);
    },
  });
}
