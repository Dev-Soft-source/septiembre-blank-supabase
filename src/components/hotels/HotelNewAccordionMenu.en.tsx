import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "@/hooks/useTranslation";
import calculatorSpanish from "@/assets/calculator-spanish.png";
import calculatorEnglish from "@/assets/calculator-english.png";
export function HotelNewAccordionMenuEN() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const {
    t
  } = useTranslation('hotel-accordion');
  const handleItemToggle = (value: string) => {
    setOpenItem(openItem === value ? null : value);
  };
  return <div className="pt-4 border-t border-yellow-300/30 rounded-lg p-6 shadow-lg backdrop-blur-sm mb-2 py-[15px] my-0 bg-[#c458fa] px-[11px]">
      <Accordion type="single" collapsible className="w-full space-y-3" value={openItem || ""} onValueChange={setOpenItem}>
        
        <AccordionItem value="benefits" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-3 sm:px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300 text-slate-50 bg-slate-700 hover:bg-slate-600">
            <div className="text-[#FFF9B0] font-bold text-sm sm:text-base md:text-lg">
              1 - THE BENEFITS
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 sm:px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-4 sm:space-y-6 text-left py-4 sm:py-6">
              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-base sm:text-lg">1.1 100% occupancy all year round</h4>
                <div className="space-y-1 sm:space-y-2 text-white text-sm sm:text-base">
                  <p>• Occupancy rates can reach 100% throughout the year</p>
                  <p>• Zero empty rooms means maximum profit</p>
                  <p>• Full occupancy even during traditionally slow periods</p>
                  <p>• Constant revenue flow without seasonal lows</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">1.2 Lower operating costs</h4>
                <div className="space-y-2 text-white">
                  <p>• Only one working day for all arrivals and departures. Zero gaps between stays</p>
                  <p>• Lower turnover rates mean lower cleaning costs</p>
                  <p>• Extended stays (8, 16, 24, and 32 days) reduce operating expenses</p>
                  <p>• Simplified check-in/out processes save staff time</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">1.3 Greater staff stability</h4>
                <div className="space-y-2 text-white">
                  <p>• Constant occupancy = year-round employment</p>
                  <p>• Lower staff turnover reduces hiring and training costs</p>
                  <p>• Higher employee satisfaction with stable schedules</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">1.4 Added income from themed activities</h4>
                <div className="space-y-2 text-white">
                  <p>• New revenue streams through specialized events</p>
                  <p>• Merchandising opportunities linked to the hotel theme</p>
                  <p>• Extended service offerings lead to higher guest spending</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="compare" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              2 - COMPARE SYSTEMS
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-red-300 font-bold text-lg">TRADITIONAL MODEL</h4>
                  <div className="space-y-2 text-white">
                    <p>• Constant arrivals/departures</p>
                    <p>• More cleaning, laundry, turnover</p>
                    <p>• Greater workload at reception</p>
                    <p>• Unpredictable occupancy</p>
                    <p>• Gaps between bookings = Empty nights = Lost profits</p>
                    <p>• High and low seasons. Staff comes and goes</p>
                    <p>• Unmotivated, untrainable, unprofessional staff</p>
                    <p>• Guests come and go. No connection, no loyalty</p>
                    <p>• Cold, isolated bookings. One after another</p>
                    <p>• Rental apartments win with lower prices</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-green-300 font-bold text-lg">HOTEL LIVING MODEL</h4>
                  <div className="space-y-2 text-white">
                    <p>• Fixed days for arrivals/departures = Smoother operations</p>
                    <p>• Fewer cleanings, fewer transitions</p>
                    <p>• More efficient and optimized reception</p>
                    <p>• Longer stays = Higher occupancy</p>
                    <p>• Zero empty nights = Maximum profit</p>
                    <p>• High season all year long. Stable staff</p>
                    <p>• Motivated, trainable, professional staff</p>
                    <p>• Guests feel at home and return</p>
                    <p>• Not just bookings: communities</p>
                    <p>• Elegance. Humanity. Service. Hotels win</p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="fill-rooms" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              3 - WE DON'T JUST FILL ROOMS
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-2 text-white">
                <p>• Guests grouped by shared interests</p>
                <p>• Zero randomness. 100% connections</p>
                <p>• Hotels to belong to, not just stay at</p>
                <p>• We are transforming society</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="profit-lost" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              4 - HOW MUCH PROFIT IS BEING LOST?
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">4.1 Western hotels: How much profit do we lose each year?</h4>
                <div className="space-y-2 text-white">
                  <p>• $90 billion each year, according to the most conservative estimates</p>
                  <p>• And this is not "revenue", but pure profit, before taxes</p>
                  <p>• The real average occupancy rate of Western hotels is 50%</p>
                  <p>• This covers costs and generates some income</p>
                  <p>• But also means losing almost pure profit from the other 50% empty rooms</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">4.2 How much profit is your hotel losing each year?</h4>
                <div className="space-y-2 text-white">
                  <p>• Five empty rooms on average each day = about $55,000 lost annually</p>
                  <p>• 20 empty rooms per day = about $220,000 in pure profit lost</p>
                  <p>• A 200-room hotel closed from October to May loses over $1 million plus $420,000 in expenses</p>
                  <p>• And a 500-room hotel? Over $3 million in profit lost per year. And the losses… better not to look</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">4.3 Yes. The vast majority of hotels miss out on their true profit potential</h4>
                <div className="space-y-2 text-white">
                  <p>• Empty rooms are our untapped gold</p>
                  <p>• Few reach 100% occupancy all year</p>
                  <p>• It doesn't matter if we're 3 or 5 stars: we all lose money</p>
                  <p>• Pure profit rooms go unsold</p>
                  <p>• We are giving up our rightful place in society</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="affinity-hotels" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              5 - WHAT ARE AFFINITY HOTELS?
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">Example 1</h4>
                <div className="space-y-2 text-white">
                  <p>• Imagine a hotel focused on tango, theater, or sports — cycling, golf, tennis, etc.</p>
                  <p>• People interested in that theme book together</p>
                  <p>• A community forms around shared interests</p>
                  <p>• No gaps between stays. No losses</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">Example 2</h4>
                <div className="space-y-2 text-white">
                  <p>• Consider a culinary-themed hotel</p>
                  <p>• Chefs, cooking classes, wine pairings, etc.</p>
                  <p>• Premium rates for specialized experiences</p>
                  <p>• Full occupancy with longer average stays</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">Example 3</h4>
                <div className="space-y-2 text-white">
                  <p>• Language immersion hotels</p>
                  <p>• Guests grouped by similar language level</p>
                  <p>• Staff speaks the target language</p>
                  <p>• Full linguistic experience</p>
                </div>
              </div>
              
              <p className="text-[#FFF9B0] italic mt-4">These specialized hotels create powerful community experiences while maintaining stable and predictable income.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="technology" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              6 - OUR TECHNOLOGY DOES WHAT NO OTHER CAN
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-2 text-white">
                <p>• Connects people with shared interests</p>
                <p>• Coordinates arrivals and departures for zero gaps</p>
                <p>• Optimizes stays for maximum profitability</p>
                <p>• One platform. Multiple revenue streams</p>
                <p>• Precise segmentation by interest and affinity</p>
                <p>• Marketing to motivated communities, not random travelers</p>
                <p>• Global reach with hyper-specific targeting</p>
                <p>• Higher conversion rates. Lower acquisition costs</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="social-networks" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              7 - AFFINITY HOTELS = PERFECT SOCIAL NETWORKS
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-2 text-white">
                <p>• Shared interests create instant connections</p>
                <p>• Group psychology drives longer stays and repeat visits</p>
                <p>• Themed activities increase engagement and loyalty</p>
                <p>• Community belonging becomes addictive</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="they-need" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              8 - THEY NEED YOUR HOTEL
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">BECAUSE 40% OF THE WESTERN POPULATION:</h4>
                <div className="space-y-2 text-white">
                  <p>• Lives alone or as a couple</p>
                  <p>• Is pre-retired or retired</p>
                  <p>• Works online</p>
                  <p>• Is a student living far from home</p>
                  <p>• Lives too far from work</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">AND MOST OF THEM:</h4>
                <div className="space-y-2 text-white">
                  <p>• Want to be free from household chores</p>
                  <p>• Feel too lonely</p>
                  <p>• Have no family ties</p>
                  <p>• Want to expand their social life</p>
                  <p>• Want to meet people with similar tastes and mindsets</p>
                  <p>• Need the complete security of living in a hotel, especially older or single people</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">BECAUSE THE DREAM OF HUMANITY IS TO LIVE IN A HOTEL</h4>
                <div className="space-y-2 text-white">
                  <p>With everything taken care of</p>
                  <p>On an endless vacation</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-[#FFF9B0] font-bold">So why do we have 50% of rooms empty every year?</p>
                <div className="space-y-2 text-white">
                  <p>Because people want to socialize. Make friends</p>
                  <p>They want to stay longer at your hotel</p>
                  <p>They want you to handle their household chores</p>
                  <p>They urgently need your empty rooms and services</p>
                  <p className="text-[#FFF9B0] font-bold">Help them: give them both</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="revolution" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              9 - AFFINITIES ARE THE NEW SOCIAL REVOLUTION
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-2 text-white">
                <p>• Guests don't just want rooms: they want meaning</p>
                <p>• Interests connect faster than discounts</p>
                <p>• Themed stays generate loyalty</p>
                <p>• Strangers become communities</p>
                <p>• You don't just fill rooms: you create belonging</p>
                <p>• Attract the right guests, not just anyone</p>
                <p>• Your affinity is your magnet</p>
                <p>• Hotels with soul are the ones that win the future</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="integration" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              10 - WE ARE PERFECT INTEGRATION
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-2 text-white">
                <p>• You don't have to choose between systems</p>
                <p>• Combine both models as you wish</p>
                <p>• Start with just a few rooms and expand as needed</p>
                <p>• Switch more rooms to our system when it makes sense</p>
                <p>• Our platform integrates seamlessly with your current operations</p>
                <p>• Zero disruptions in your daily operations</p>
                <p>• We adapt to you, not the other way around</p>
              </div>
              <p className="text-[#FFF9B0] font-bold text-center mt-4">
                This is flexibility. This is profitability.<br />
                This is Perfect Integration
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="steps" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              11 - STEPS TO JOIN HOTEL-LIVING
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">1. IDENTIFY YOUR AVAILABLE ROOMS</h4>
                <div className="space-y-2 text-white">
                  <p>Evaluate how many of your hotel's rooms are empty for at least 8 consecutive days (7 nights) at certain times of the year.</p>
                  <p>You don't need to convert the entire property — you can reserve part of your inventory for traditional bookings, and free up other rooms for Hotel Living guests. This allows you to increase occupancy and profitability without disrupting your usual operations.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">2. DEFINE A CONCEPT BASED ON AFFINITIES</h4>
                <div className="space-y-2 text-white">
                  <p>Think of an "affinity" that could attract your ideal type of guest, based on your hotel's location, your usual clientele, or even your own preferences as the owner.</p>
                  <p>The possibilities are endless, for example:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Nature and hiking (for mountain locations)</li>
                    <li>Water sports or beach wellness (for coastal locations)</li>
                    <li>Wine tasting, painting, wellness, remote work, dance, science, culture, theater, or any other theme, hobby or lifestyle</li>
                  </ul>
                  <p className="italic">NOTE: The affinity doesn't exclude other types of guests. It simply helps position your hotel better in the market and lets guests self-select according to their ideal setting.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">3. REGISTER AND USE THE ONLINE CALCULATOR</h4>
                <div className="space-y-2 text-white">
                  <p>Once registered, you'll have access to our Hotel Living calculator, a powerful tool to test stay models (8, 16, 24, or 32 nights).</p>
                  <p>You can set prices, run financial simulations, and adjust your offer according to occupancy and revenue forecasts.</p>
                  <p className="font-bold text-[#FFF9B0]">The goal is clear: fill your rooms — don't leave them empty.</p>
                </div>
                
                <div className="bg-[#460F54]/50 p-4 rounded-lg mt-4">
                  <h5 className="text-[#FFF9B0] font-bold mb-2">FOR EXAMPLE:</h5>
                  <div className="space-y-2 text-white text-sm">
                    <p>If you have 30 available rooms and set prices too high, you may only fill 15 — and the other 15 stay empty, generating no income but incurring costs. Plus, your hotel will look empty.</p>
                    <p>If you lower prices a little, you can fill all 30 — generating more total income, more life in your hotel, and new opportunities.</p>
                    <p>It's the same principle airlines use: they prefer to sell the last seat for $5 rather than leave it empty.</p>
                    <p className="font-bold text-[#FFF9B0]">EVERY EMPTY SPACE IS LOST REVENUE.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[#FFF9B0] font-bold text-lg">4. ADD YOUR HOTEL TO YOUR DASHBOARD</h4>
                <div className="space-y-2 text-white">
                  <p>Once you've defined your theme and pricing model, access your dashboard and complete the steps to "Add new property".</p>
                  <p>From there you can manage availability, visibility, and long-stay bookings.</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="calculator" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              12 - {t('calculator.title')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-4 text-white whitespace-pre-line">
                {t('calculator.text')}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-3">
                  <h4 className="text-[#FFF9B0] font-bold text-lg">English Version</h4>
                  <img src="/lovable-uploads/a434a2cc-c665-4c9b-828a-d5945a335947.png" alt="Hotel-Living Calculator English Version" className="w-full h-auto rounded-lg border border-[#FFF9B0]/30 shadow-lg" />
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-[#FFF9B0] font-bold text-lg">Spanish Version</h4>
                  <img src="/lovable-uploads/132f46c4-4760-4907-bb8a-30ea52da9991.png" alt="Hotel-Living Calculator Spanish Version" className="w-full h-auto rounded-lg border border-[#FFF9B0]/30 shadow-lg" />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>;
}