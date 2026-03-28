import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
export default function HotelPartnerAgreement() {
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 pb-12">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-[#f0dff2]">Hotel Partner Agreement</h1>
          
          <div className="glass-card rounded-xl p-8">
            <div className="prose prose-invert max-w-none">
              <h2>HOTEL PARTNER AGREEMENT</h2>
              
              <p className="text-sm text-muted-foreground mb-6">
                Last Updated: March 30, 2025
              </p>
              
              <p>This Hotel Partner Agreement ("Agreement") is entered into between Hotels Life, Inc. ("Company") and the hotel or property owner ("Partner") who completes the registration process on our platform. This Agreement governs the Partner's participation in our extended-stay, theme-based accommodation program.

            </p>
              
              <h3>1. PROGRAM BENEFITS</h3>
              
              <p>
                The Hotels Life program offers Partners the following key benefits:
              </p>
              
              <ul>
                <li>100% year-round occupancy potential</li>
                <li>Elimination of traditionally vacant rooms</li>
                <li>Profitable extended stays of 8, 16, 24, and 32 days</li>
                <li>Reduced turnover and operational costs</li>
                <li>Streamlined check-in/check-out management (one day per week)</li>
                <li>Enhanced staff stability and dedication</li>
                <li>Theme-based guest communities that increase retention</li>
                <li>Unique service opportunities and activities</li>
                <li>Community integration possibilities</li>
                <li>Exclusive room monetization programs

              </li>
              </ul>
              
              <h3>2. PARTNER OBLIGATIONS</h3>
              
              <p>As a Hotel Partner, you agree to:

            </p>
              
              <ol type="a">
                <li>Maintain the quality standards required by the Company</li>
                <li>Provide clean, safe, and fully-functional accommodations</li>
                <li>Honor all bookings made through the platform</li>
                <li>Implement at least one approved theme program</li>
                <li>Organize regular theme-based activities</li>
                <li>Designate a community manager for guest experiences</li>
                <li>Provide accurate information about your property</li>
                <li>Process payments directly from guests</li>
                <li>Pay the agreed commission to the Company</li>
                <li>Participate in regular quality assurance reviews

              </li>
              </ol>
              
              <h3>3. BOOKING AND FINANCIAL TERMS</h3>
              
              <p>
                <strong>Booking Process:</strong> Guests reserve accommodations through our platform with a 10% deposit. 
                The remaining balance is paid directly to you upon guest arrival.
              </p>
              
              <p>
                <strong>Commission Structure:</strong> The Company collects a commission of 15% on all bookings 
                made through the platform. Commission payments are processed monthly.
              </p>
              
              <p>
                <strong>
Cancellation Policy:</strong> Standard cancellations made 30+ days before arrival receive 
                a full refund. Cancellations within 30 days are subject to your property's cancellation policy, 
                which must be clearly communicated during registration.
              </p>
              
              <h3>

4. THEME IMPLEMENTATION</h3>
              
              <p>
                Partners must implement at least one approved theme from our selection. Each theme requires:
              </p>
              
              <ul>
                <li>Dedicated facilities relevant to the theme</li>
                <li>Regular programming (minimum weekly activities)</li>
                <li>Qualified staff or partners to facilitate activities</li>
                <li>Appropriate décor and atmosphere</li>
              </ul>
              
              <p>The Company will provide theme implementation guidelines and ongoing support.

            </p>
              
              <h3>5. TERM AND TERMINATION</h3>
              
              <p>
                <strong>Initial Term:</strong> This Agreement has an initial term of 12 months from the date of activation.
              </p>
              
              <p>
                <strong>Renewal:</strong> The Agreement automatically renews for successive 12-month periods unless 
                either party provides written notice of non-renewal at least 60 days before the end of the current term.
              </p>
              
              <p>
                <strong>Termination:</strong> Either party may terminate this Agreement for material breach with 30 days' 
                written notice if the breach remains uncured. The Company may terminate immediately if Partner fails to 
                maintain quality standards or violates guest trust.
              </p>
              
              <h3>

6. ADDITIONAL TERMS</h3>
              
              <p>
                <strong>Intellectual Property:</strong> The Company owns all intellectual property related to the 
                platform, including logos, trademarks, and theme concepts. Partners receive a limited license to use 
                these materials during the term of the Agreement.
              </p>
              
              <p>
                <strong>Exclusivity:</strong> Partners may offer similar extended stay programs independently but 
                may not participate in competing theme-based platforms without prior written consent.
              </p>
              
              <p>
                <strong>Indemnification:</strong> Each party agrees to indemnify the other for claims arising from 
                their breach of this Agreement or negligent acts.
              </p>
              
              <p>
                <strong>Insurance:</strong> Partners must maintain appropriate liability insurance coverage and 
                provide proof upon request.
              </p>
              
              <h3>

7. AGREEMENT ACCEPTANCE</h3>
              
              <p>
                By registering as a Hotel Partner, you acknowledge that you have read, understood, and agree to be 
                bound by all terms and conditions of this Agreement.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
}