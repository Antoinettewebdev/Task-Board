export const FieldError = ({ error }: { error?: string }) =>
  error ? <div className="text-red-500 text-sm">{error}</div> : null;