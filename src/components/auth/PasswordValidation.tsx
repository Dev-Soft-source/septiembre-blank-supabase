
import { validatePassword, passwordRequirementsText } from "@/utils/passwordValidation";
import { CheckCircle2, XCircle } from "lucide-react";

interface PasswordValidationProps {
  password: string;
  showRequirements: boolean;
}

export function PasswordValidation({ password, showRequirements }: PasswordValidationProps) {
  const { requirements } = validatePassword(password);
  const reqArray = Object.values(requirements);

  if (!showRequirements) return null;

  return (
    <div className="mt-2 text-xs space-y-1">
      {passwordRequirementsText.map((text, index) => (
        <div key={text} className="flex items-center gap-2">
          {reqArray[index] ? (
            <CheckCircle2 className="w-3 h-3 text-green-500" />
          ) : (
            <XCircle className="w-3 h-3 text-red-500" />
          )}
          <span className={reqArray[index] ? "text-green-500" : "text-red-500"}>
            {text}
          </span>
        </div>
      ))}
    </div>
  );
}
