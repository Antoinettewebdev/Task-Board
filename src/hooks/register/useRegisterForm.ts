import { useForm } from "@tanstack/react-form";
import { useRegister } from "@/hooks/register/useRegister";
import { useGoogleRegister } from "@/hooks/register/useGoogleRegister";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const onSuccess = () => navigate({ to: "/login" });

  const registerMutation = useRegister(onSuccess, setFormError);
  const googleRegister = useGoogleRegister(onSuccess, setFormError);

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

  const handleGoogleSignUp = () => {
    setFormError(null);
    googleRegister.mutate();
  };

  return {
    form,
    formError,
    setFormError,
    handleGoogleSignUp,
    loading: registerMutation.isPending,
    googleLoading: googleRegister.isPending,
  };
};
