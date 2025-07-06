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
import type { LoginFormValues } from "@/Types/LoginTypes";
import { useState } from "react";
import { pb } from "@/lib/PocketBase";

export const Login = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  // Google Login handler
  const handleGoogleLogin = async () => {
    setFormError(null);
    setGoogleLoading(true);
    try {
      await pb.collection("users").authWithOAuth2({ provider: "google" });
      navigate({ to: "/todos" });
    } catch (err) {
      if (err instanceof Error && err.message) {
        setFormError(err.message);
      } else {
        setFormError("Google login failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }: { value: LoginFormValues }) => {
      setFormError(null);
      setLoading(true);
      try {
        await pb
          .collection("users")
          .authWithPassword(value.email, value.password);
        navigate({ to: "/todos" });
      } catch (err) {
        if (err instanceof Error && err.message) {
          setFormError(err.message);
        } else {
          setFormError("Invalid credentials or email not verified.");
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
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
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
                {/* Email Input Textfield */}
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
                      if (!value) return "Password is required";
                      if (value.length < 8)
                        return "Password must be at least 8 characters";
                    },
                  }}
                  children={(field) => (
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor={field.name}>Password</Label>
                        <Link
                          to="/forgotPassword"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="*"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
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
                    className="w-full"
                    type="submit"
                    disabled={loading || googleLoading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    disabled={loading || googleLoading}
                    onClick={handleGoogleLogin}
                  >
                    {googleLoading
                      ? "Logging in with Google..."
                      : "Login with Google"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don’t have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:underline"
                  >
                    Sign up
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
