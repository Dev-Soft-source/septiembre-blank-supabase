
import React from "react";
import { EnglishTermsContent } from "./terms/EnglishTermsContent";

export function TermsConditionsContentEN() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-8 bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 border border-purple-500/20">
        <EnglishTermsContent />
      </div>
    </div>
  );
}
