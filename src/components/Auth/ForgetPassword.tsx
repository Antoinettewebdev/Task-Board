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
import { Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { pb } from "@/lib/PocketBase";
import type { ForgetPasswordType } from "@/Types/ForgetPasswordType";

export const ForgetPassword = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }: { value: ForgetPasswordType }) => {
      setFormError(null);
      setSuccessMsg(null);
      setLoading(true);
      try {
        // Check if user exists before sending reset
        const users = await pb.collection("users").getFullList({
          filter: `email = "${value.email}"`,
          limit: 1,
        });

        if (!users || users.length === 0) {
          setFormError("No account found with that email address.");
        } else {
          await pb.collection("users").requestPasswordReset(value.email);
          setSuccessMsg("A reset link has been sent to your email address.");
        }
      } catch (err) {
        if (err instanceof Error && err.message) {
          setFormError(err.message);
        } else {
          setFormError("Failed to send reset link. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Forgot your password?</CardTitle>
            <CardDescription>
              Enter the email associated with your account and we'll send you a
              reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
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
                      disabled={loading}
                    />
                    {field.state.meta.errors && (
                      <div className="text-red-500 text-sm">
                        {field.state.meta.errors}
                      </div>
                    )}
                  </div>
                )}
              />

              {/* Form Error / Success */}
              {formError && (
                <div className="text-red-500 text-center text-sm">
                  {formError}
                </div>
              )}
              {successMsg && (
                <div className="text-green-600 text-center text-sm">
                  {successMsg}
                </div>
              )}

              {/* Reset Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Reset password"}
              </Button>

              {/* Back to Login */}
              <div className="text-center text-sm">
                <Link to="/login" className="text-blue-600 hover:underline">
                  Back to login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
