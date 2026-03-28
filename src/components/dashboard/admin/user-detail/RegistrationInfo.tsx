
import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTimeAgo } from "@/components/dashboard/utils/dateUtils";

interface RegistrationInfoProps {
  createdAt: string;
  isActive: boolean | undefined;
  lastSignInAt: string | undefined;
}

export const RegistrationInfo: React.FC<RegistrationInfoProps> = ({
  createdAt,
  isActive,
  lastSignInAt
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-2 text-sm text-gray-500">
      <div className="flex items-center">
        Registered on: {formatDate(createdAt)}
        {isActive === false && (
          <Badge variant="destructive" className="ml-2">Deactivated</Badge>
        )}
        {isActive === true && (
          <Badge variant="success" className="ml-2">Active</Badge>
        )}
      </div>
      
      {lastSignInAt && (
        <div>
          Last login: {formatDate(lastSignInAt)} ({formatTimeAgo(lastSignInAt)})
        </div>
      )}
    </div>
  );
};
