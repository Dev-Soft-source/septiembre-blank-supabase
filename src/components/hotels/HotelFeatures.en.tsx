
import { Calendar, DollarSign, Users } from "lucide-react";

export function HotelFeaturesEN() {
  return (
    <div className="mt-16 text-center">
      <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-[#ebd4ee] to-[#f5ecf6] bg-clip-text text-transparent animate-fade-in transition-all duration-300 hover:scale-105">Why Join Hotel Living?</h2>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="glass-card p-6 rounded-xl bg-gradient-to-b from-[#6a0a95] to-[#460F54] transform hover:scale-105 transition-all duration-300 border border-fuchsia-400/30 shadow-lg hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <div className="w-16 h-16 rounded-full bg-fuchsia-500/20 flex items-center justify-center mx-auto mb-4 border border-fuchsia-400/30 transition-all duration-300 hover:scale-110 hover:bg-fuchsia-500/30">
            <Calendar className="h-8 w-8 text-fuchsia-300 transition-all duration-300 hover:text-fuchsia-200" />
          </div>
          <h3 className="text-lg font-semibold mb-3 text-[#f5ecf6] transition-all duration-300 hover:text-white">Full Occupancy</h3>
          <p className="text-sm text-[#f0e3f2]/90 transition-all duration-300 hover:text-[#f0e3f2]">Keep your hotel fully booked year-round with our dedicated community of long-stay guests.</p>
        </div>
        <div className="glass-card p-6 rounded-xl bg-gradient-to-b from-[#6a0a95] to-[#460F54] transform hover:scale-105 transition-all duration-300 border border-fuchsia-400/30 shadow-lg hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          <div className="w-16 h-16 rounded-full bg-fuchsia-500/20 flex items-center justify-center mx-auto mb-4 border border-fuchsia-400/30 transition-all duration-300 hover:scale-110 hover:bg-fuchsia-500/30">
            <DollarSign className="h-8 w-8 text-fuchsia-300 transition-all duration-300 hover:text-fuchsia-200" />
          </div>
          <h3 className="text-lg font-semibold mb-3 text-[#f5ecf6] transition-all duration-300 hover:text-white">Higher Revenue</h3>
          <p className="text-sm text-[#f0e3f2]/90 transition-all duration-300 hover:text-[#f0e3f2]">Generate more income with longer stays and reduced operational costs through fewer turnovers.</p>
        </div>
        <div className="glass-card p-6 rounded-xl bg-gradient-to-b from-[#6a0a95] to-[#460F54] transform hover:scale-105 transition-all duration-300 border border-fuchsia-400/30 shadow-lg hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <div className="w-16 h-16 rounded-full bg-fuchsia-500/20 flex items-center justify-center mx-auto mb-4 border border-fuchsia-400/30 transition-all duration-300 hover:scale-110 hover:bg-fuchsia-500/30">
            <Users className="h-8 w-8 text-fuchsia-300 transition-all duration-300 hover:text-fuchsia-200" />
          </div>
          <h3 className="text-lg font-semibold mb-3 text-[#f5ecf6] transition-all duration-300 hover:text-white">Global Network</h3>
          <p className="text-sm text-[#f0e3f2]/90 transition-all duration-300 hover:text-[#f0e3f2]">Join a worldwide network of hotels catering to affinity travelers and digital nomads.</p>
        </div>
      </div>
    </div>
  );
}
