export const validateEmail = ({ value }: { value: string }) => {
  if (!value) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "Please enter a valid email address";
};

export const validatePassword = ({ value }: { value: string }) => {
  if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
};


export const validatePasswordConfirm = ({
  value,
  password,
}: {
  value: string;
  password: string;
}) => {
  if (!value) return "Confirm password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  if (value !== password) return "Passwords do not match";
};

