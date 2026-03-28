
import React from "react";

export function StepsToJoinSection() {
  return (
    <div className="space-y-8 text-left py-6">
      <div>
        <h3 className="text-lg font-bold text-[#FFF9B0] mb-4">1. IDENTIFY YOUR AVAILABLE ROOMS</h3>
        <p className="text-base text-[#FFF9B0] mb-3">
          Assess how many rooms in your hotel remain empty for at least 8 consecutive days (7 nights) at certain times of the year.
        </p>
        <p className="text-base text-[#FFF9B0]">
          You don't need to convert the entire property — you can reserve part of your inventory for traditional bookings, and release other rooms for Hotel Living guests. This allows you to increase occupancy and profitability without disrupting your regular operation.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#FFF9B0] mb-4">2. DEFINE A CONCEPT BASED ON AFFINITIES</h3>
        <p className="text-base text-[#FFF9B0] mb-3">
          Think of an "affinity" that might attract your ideal guest, based on your hotel's location, typical clientele, or even your own interests as the owner.
        </p>
        <p className="text-base text-[#FFF9B0] mb-3">The possibilities are endless, such as:</p>
        
        <div className="pl-4 space-y-2 mb-4">
          <p className="text-base flex items-start text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Nature and hiking (for mountain locations)</p>
          <p className="text-base flex items-start text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Water sports or wellness at the beach (for coastal areas)</p>
          <p className="text-base flex items-start text-[#FFF9B0]"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> Wine tasting, painting, wellness, remote work, dance, science, culture, theatre, or any other theme, hobby or lifestyle</p>
        </div>
        
        <p className="text-base font-semibold text-[#FFF9B0]">
          NOTE: Affinity does not exclude other guests. It just helps you position your hotel better in the market and allows guests to self-select based on their ideal environment.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#FFF9B0] mb-4">3. REGISTER AND USE THE ONLINE CALCULATOR</h3>
        <p className="text-base text-[#FFF9B0] mb-3">
          Once registered, you'll gain access to our Hotel Living calculator, a powerful tool to test stay models (8, 16, 24 or 32 nights).
        </p>
        <p className="text-base text-[#FFF9B0] mb-3">
          You'll be able to set prices, run financial simulations, and adjust your offer based on occupancy and revenue projections.
        </p>
        <p className="text-base font-semibold text-[#FFF9B0] mb-4">The goal is clear: fill your rooms — don't leave them empty.</p>
        
        <div className="bg-[#460F54]/20 rounded-lg p-4 mb-4">
          <p className="text-base font-bold text-[#FFF9B0] mb-2">FOR EXAMPLE:</p>
          <p className="text-base text-[#FFF9B0] mb-2">
            If you have 30 rooms available and set prices too high, you might only fill 15 — and the other 15 will remain empty, generating no revenue but still incurring costs. On top of that, your hotel will look deserted.
          </p>
          <p className="text-base text-[#FFF9B0] mb-2">
            But if you lower prices just a bit, you could fill all 30 — generating higher total revenue, more life in your hotel, and new opportunities.
          </p>
          <p className="text-base text-[#FFF9B0] mb-2">
            It's the same principle airlines use: they prefer to sell the last seat for $5 than to leave it empty.
          </p>
          <p className="text-base font-bold text-[#FFF9B0]">EVERY EMPTY SPACE IS LOST INCOME.</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#FFF9B0] mb-4">4. ADD YOUR HOTEL IN YOUR DASHBOARD</h3>
        <p className="text-base text-[#FFF9B0] mb-3">
          Once you've defined your theme and pricing model, access your dashboard and complete the steps to "Add new property".
        </p>
        <p className="text-base text-[#FFF9B0]">
          From there, you'll be able to manage availability, visibility, and long-stay bookings.
        </p>
      </div>
    </div>
  );
}
