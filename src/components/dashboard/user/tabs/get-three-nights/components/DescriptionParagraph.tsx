
import React from "react";

interface DescriptionParagraphProps {
  children: React.ReactNode;
  className?: string;
}

export const DescriptionParagraph: React.FC<DescriptionParagraphProps> = ({ 
  children, 
  className = "" 
}) => {
  return <p className={`${className}`}>{children}</p>;
};
