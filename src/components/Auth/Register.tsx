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
import { useRegisterForm } from "@/hooks/register/useRegisterForm";
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
} from "@/lib/validators/validators";

export const Register = () => {
  const { form, formError, loading, googleLoading, handleGoogleSignUp } =
    useRegisterForm();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
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
                      disabled={loading || googleLoading}
                    />
                    <FieldError error={field.state.meta.errors?.[0]} />
                  </div>
                )}
              />

              <form.Field
                name="password"
                validators={{ onChange: validatePassword }}
                children={(field) => (
                  <div className="grid gap-3">
                    <Label htmlFor={field.name}>Password</Label>
                    <Input
                      id={field.name}
                      type="password"
                      placeholder=""
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={loading || googleLoading}
                    />

                    <FieldError error={field.state.meta.errors?.[0]} />
                  </div>
                )}
              />

              <form.Field
                name="confirmPassword"
                validators={{
                  onChange: ({ value }) =>
                    validatePasswordConfirm({
                      value,
                      password: form.getFieldValue("password"),
                    }),
                }}
                children={(field) => (
                  <div className="grid gap-3">
                    <Label htmlFor={field.name}>Confirm Password</Label>
                    <Input
                      id={field.name}
                      type="password"
                      placeholder=""
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={loading || googleLoading}
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
                  onClick={() => {
                    handleGoogleSignUp();
                  }}
                  disabled={loading || googleLoading}
                >
                  {googleLoading
                    ? "Signing up with Google..."
                    : "Sign Up with Google"}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Log In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
