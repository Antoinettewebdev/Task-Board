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
import { useLoginForm } from "@/hooks/login/useLoginForm";
import { validateEmail, validatePassword } from "@/lib/validators/validators";
import { FieldError } from "@/components/Auth/FieldError";

export const Login = () => {
  const { form, loginMutation, googleLogin, formError, setFormError } =
    useLoginForm();

  const isLoading = loginMutation.isPending || googleLogin.isPending;

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
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
              <form.Field name="email" validators={{ onChange: validateEmail }}>
                {(field) => (
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                    />
                    <FieldError error={field.state.meta.errors?.[0]} />
                  </div>
                )}
              </form.Field>

              {/* Password Field */}
              <form.Field
                name="password"
                validators={{ onChange: validatePassword }}
              >
                {(field) => (
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forget-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder=""
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                    />
                    <FieldError error={field.state.meta.errors?.[0]} />
                  </div>
                )}
              </form.Field>

              {/* Form Error */}
              {formError && (
                <div className="text-red-500 text-center text-sm">
                  {formError}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setFormError(null);
                    googleLogin.mutate();
                  }}
                  disabled={isLoading}
                >
                  {googleLogin.isPending
                    ? "Logging in with Google..."
                    : "Login with Google"}
                </Button>
              </div>

              {/* Footer */}
              <div className="mt-4 text-center text-sm">
                Don’t have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
