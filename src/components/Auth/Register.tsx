import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import type { RegisterFormType } from "@/Types/RegisterFormType";
import { useState } from "react";
import { pb } from "@/lib/PocketBase";

export const Register = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  // Google Sign Up handler
  const handleGoogleSignUp = async () => {
    setFormError(null);
    setGoogleLoading(true);
    try {
      // This will open a popup for Google OAuth
      await pb.collection("users").authWithOAuth2({ provider: "google" });
      // After successful auth, you may want to redirect
      navigate({ to: "/todos" });
    } catch (err) {
      if (err instanceof Error && err.message) {
        setFormError(err.message);
      } else {
        setFormError("Google sign up failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }: { value: RegisterFormType }) => {
      setFormError(null);
      setLoading(true);
      try {
        await pb.collection("users").create({
          email: value.email,
          password: value.password,
          passwordConfirm: value.password,
        });
        navigate({ to: "/login" });
      } catch (err) {
        if (err instanceof Error && err.message) {
          setFormError(err.message);
        } else {
          setFormError("Registration failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className=" flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Enter your details to create a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="flex flex-col gap-6"
              >
                {/* Email Field */}
                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return "Email is required";
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(value)) {
                        return "Please enter a valid email address";
                      }
                    },
                  }}
                  children={(field) => (
                    <div className="grid gap-3">
                      <Label htmlFor={field.name}>Email</Label>
                      <Input
                        id={field.name}
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={loading || googleLoading}
                      />
                      {field.state.meta.errors && (
                        <div className="text-red-500 text-sm">
                          {field.state.meta.errors}
                        </div>
                      )}
                    </div>
                  )}
                />
                {/* Password Field */}
                <form.Field
                  name="password"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return "Password is required";
                      if (value.length < 8)
                        return "Password must be at least 8 characters";
                    },
                  }}
                  children={(field) => (
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor={field.name}>Password</Label>
                      </div>
                      <Input
                        id={field.name}
                        type="password"
                        placeholder=""
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={loading || googleLoading}
                      />
                      {field.state.meta.errors && (
                        <div className="text-red-500 text-sm">
                          {field.state.meta.errors}
                        </div>
                      )}
                    </div>
                  )}
                />
                {/* Confirm Password Field */}
                <form.Field
                  name="confirmPassword"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return "Password is required";
                      if (value.length < 8)
                        return "Password must be at least 8 characters";
                    },
                  }}
                  children={(field) => (
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor={field.name}>Confirm Password</Label>
                      </div>
                      <Input
                        id={field.name}
                        type="password"
                        placeholder=""
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={loading || googleLoading}
                      />
                      {field.state.meta.errors && (
                        <div className="text-red-500 text-sm">
                          {field.state.meta.errors}
                        </div>
                      )}
                    </div>
                  )}
                />
                {/* Form Error */}
                {formError && (
                  <div className="text-red-500 text-center text-sm">
                    {formError}
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || googleLoading}
                  >
                    {loading ? "Signing up..." : "Sign Up"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={loading || googleLoading}
                    onClick={handleGoogleSignUp}
                  >
                    {googleLoading
                      ? "Signing up with Google..."
                      : "Sign Up with Google"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{""}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Log In
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
