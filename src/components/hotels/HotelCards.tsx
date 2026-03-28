import { useNavigate } from "react-router-dom";
import { Building, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export function HotelCards() {
  const navigate = useNavigate();
  const handleCardClick = (path: string) => {
    window.location.href = path;
  };
  return <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
      <Card className="glass-card-hover rounded-xl overflow-hidden bg-gradient-to-b from-[#6a0a95] to-[#460F54] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] border border-fuchsia-400/30" onClick={() => handleCardClick("https://hotel-living.com/login/hotel")}>
        <CardHeader className="pb-4 bg-gradient-to-b from-[#6d0591] to-[#5D0478]">
          <div className="w-16 h-16 rounded-full bg-fuchsia-500/20 flex items-center justify-center mx-auto mb-3 border border-fuchsia-400/30 shadow-inner">
            <Building className="h-8 w-8 text-fuchsia-300" />
          </div>
          <CardTitle className="text-xl text-center text-[#f5ecf6]">HOTEL ASOCIADO</CardTitle>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <Button className="text-white font-medium bg-[#860493] hover:bg-[#460F54] border border-fuchsia-400/30 shadow-md hover:shadow-xl transition-all duration-300">LOGIN</Button>
        </CardContent>
      </Card>
      
      
      
      <Card className="glass-card-hover rounded-xl overflow-hidden bg-gradient-to-b from-[#6a0a95] to-[#460F54] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] border border-fuchsia-400/30" onClick={() => handleCardClick("https://hotel-living.com/registerHotel")}>
        <CardHeader className="pb-4 bg-gradient-to-b from-[#6d0591] to-[#5D0478]">
          <div className="w-16 h-16 rounded-full bg-fuchsia-500/20 flex items-center justify-center mx-auto mb-3 border border-fuchsia-400/30 shadow-inner">
            <Building className="h-8 w-8 text-fuchsia-300" />
          </div>
          <CardTitle className="text-xl text-center text-[#f5ecf6]">REGISTRO</CardTitle>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <Button className="bg-[#860493] hover:bg-[#460F54] text-white font-medium border border-fuchsia-400/30 shadow-md hover:shadow-xl transition-all duration-300">HOTEL</Button>
        </CardContent>
      </Card>
    </div>;
}