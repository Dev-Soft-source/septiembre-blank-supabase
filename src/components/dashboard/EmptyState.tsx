import React, { ReactNode } from 'react';
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
}
export const EmptyState = ({
  icon,
  title,
  description
}: EmptyStateProps) => {
  return <div className="glass-card rounded-2xl p-6 h-full flex flex-col items-center justify-center py-16 text-center bg-[#5c0869]">
      <div className="w-16 h-16 rounded-full bg-fuchsia-950/50 flex items-center justify-center mb-4">
        <div className="text-fuchsia-400/50">
          {icon}
        </div>
      </div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {description && <p className="text-sm text-muted-foreground max-w-md">
          {description}
        </p>}
    </div>;
};
export default EmptyState;