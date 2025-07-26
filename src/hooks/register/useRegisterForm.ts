import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { pb } from "@/lib/pocketbase"; // Ensure this is initialized correctly

type RegisterInput = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const onSuccess = () => {
    navigate({ to: "/login" });
  };

  const registerMutation = useMutation({
    mutationFn: async ({ email, password, confirmPassword }: RegisterInput) => {
      return await pb.collection("users").create({
        email,
        password,
        passwordConfirm: confirmPassword,
      });
    },
    onSuccess,
    onError: (error: unknown) => {
      let message = "Registration failed. Please try again.";
      if (error instanceof Error) {
        // Check for PocketBase structured error
        type PocketBaseError = Error & {
          response?: {
            data?: {
              email?: { message: string };
            };
            message?: string;
          };
        };
        const err = error as PocketBaseError;
        if (err?.response?.data?.email) {
          message = err.response.data.email.message;
        } else if (err?.response?.message) {
          message = err.response.message;
        } else {
          message = error.message;
        }
      }
      setFormError(message);
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: ({ value }) => {
      setFormError(null);

      if (value.password !== value.confirmPassword) {
        setFormError("Passwords do not match.");
        return;
      }

      registerMutation.mutate(value);
    },
  });

  return {
    form,
    formError,
    setFormError,
    loading: registerMutation.isPending,
  };
};