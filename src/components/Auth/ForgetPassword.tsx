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
import { FieldError } from "@/components/Auth/FieldError";
import { useForgotPasswordForm } from "@/hooks/forgetpassword/useForgetPassword";
import { validateEmail } from "@/lib/validators/validators";

export const ForgotPassword = () => {
  const { form, formError, successMsg, loading } = useForgotPasswordForm();

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
              <form.Field
                name="email"
                validators={{ onChange: validateEmail }}
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
                     <FieldError error={field.state.meta.errors?.[0]} />
                  </div>
                )}
              />

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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Reset password"}
              </Button>

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
