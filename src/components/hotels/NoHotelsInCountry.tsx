import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NoHotelsInCountryProps {
  countryName?: string;
}

export function NoHotelsInCountry({ countryName }: NoHotelsInCountryProps) {
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  const handleRecommendHotel = () => {
    // Navigate to the user dashboard or hotel referral form
    // Check if user is logged in, if not, redirect to login
    navigate("/dashboard?tab=referrals");
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/40 via-fuchsia-900/40 to-purple-800/40 backdrop-blur-sm border border-fuchsia-400/30 p-8 text-center max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-fuchsia-500/20 p-4 rounded-full">
            <MapPin className="h-12 w-12 text-fuchsia-300" />
          </div>
        </div>

        {/* Title - Large format */}
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          {t("noHotelsInCountry.title")}
        </h2>

        {/* Supporting text */}
        <p className="text-lg text-fuchsia-100 leading-relaxed">
          {t("noHotelsInCountry.description")}
        </p>

        {/* Action button */}
        <div className="pt-4">
          <Button
            onClick={handleRecommendHotel}
            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <MessageCircle className="h-5 w-5" />
            {t("noHotelsInCountry.recommendButton")}
          </Button>
        </div>
      </div>
    </Card>
  );
}