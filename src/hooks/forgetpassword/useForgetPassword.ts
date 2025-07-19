import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { pb } from "@/lib/pocketbase";


export const useForgotPasswordForm = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      await pb.collection("users").requestPasswordReset(email);
    },
    onSuccess: () => {
      setSuccessMsg("A reset link has been sent to your email address.");
      setFormError(null);
    },
    onError: (error) => {
      if (error instanceof Error && error.message) {
        setFormError("No account found with that email address.");
      } else {
        setFormError("Failed to send reset link. Please try again.");
      }
      setSuccessMsg(null);
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: ({ value }) => {
      mutation.mutate(value.email);
    },
  });

  return {
    form,
    formError,
    successMsg,
    loading: mutation.isPending,
  };
};