
import React from "react";

interface ProgramHeaderProps {
  title: string;
}

export const ProgramHeader: React.FC<ProgramHeaderProps> = ({ title }) => {
  return <h3 className="text-xl font-semibold mb-4">{title}</h3>;
};
