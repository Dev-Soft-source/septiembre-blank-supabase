// Temporary stub - authentication system has been removed
interface PasswordFieldProps {
  [key: string]: any;
}

export function PasswordField(props: PasswordFieldProps) {
  return <input type="password" {...props} />;
}