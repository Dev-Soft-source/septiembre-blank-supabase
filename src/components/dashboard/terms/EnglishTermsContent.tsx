
import React from "react";

export function EnglishTermsContent() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-2xl font-bold text-white mb-6">TERMS AND CONDITIONS – HOTEL‑LIVING (FOR PROPERTY OWNERS)</h2>
      
      <div className="space-y-8 text-gray-200">
        <section>
          <h3 className="text-xl font-semibold text-white mb-4">1. Purpose and Scope</h3>
          <p className="leading-relaxed">
            These Terms and Conditions govern the relationship between the accommodation provider (hereinafter, the "Provider") and the Hotel‑Living platform, for the publication and marketing of medium-term thematic stays.
          </p>
        </section>

        <hr className="border-purple-500/30" />

        <section>
          <h3 className="text-xl font-semibold text-white mb-4">2. Obligations</h3>
          
          <div className="mb-6">
            <h4 className="text-lg font-medium text-white mb-3">2.1. Provider's Obligations</h4>
            <p className="mb-3">The Provider commits to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Publish accurate and up-to-date information about the property.</li>
              <li>Comply with all applicable local regulations, including tax, health, and tourism legislation.</li>
              <li>Maintain the quality standards required by Hotel‑Living.</li>
              <li>Diligently manage reservations and payments received from clients.</li>
              <li>Notify Hotel‑Living if the applicable tax regime differs significantly from the standard 10% rate.</li>
              <li>Assume <strong className="text-yellow-300">full responsibility for the direct relationship with the client</strong>, including service fulfillment, cancellations, complaints, or incidents during the stay.</li>
              <li>Acknowledge that <strong className="text-yellow-300">Hotel‑Living acts solely as an intermediary platform</strong>, and does not provide the accommodation service. Any legal, contractual, or consumer disputes must be resolved between the client and the Provider according to applicable laws.</li>
              <li><strong className="text-yellow-300">Hotel‑Living may, at its discretion and upon mutual request, offer informal mediation</strong> without assuming any legal responsibility.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-white mb-3">2.2. Hotel‑Living's Obligations</h4>
            <p className="mb-3">Hotel‑Living commits to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Display the final price clearly and transparently to the client, including estimated taxes.</li>
              <li>Charge the client an advance payment of 15% of the total price, of which 7% will be transferred to the Provider as a non-refundable deposit.</li>
              <li>Transfer accumulated deposits monthly to the Provider for confirmed reservations.</li>
              <li>Issue monthly invoices detailing managed reservations and paid amounts.</li>
              <li>Respond diligently to Provider communications regarding their account, reservations, or tax adjustments.</li>
              <li>Not modify the economic conditions unilaterally without prior notice and the possibility for the Provider to opt out if no reservations are pending.</li>
            </ul>
          </div>
        </section>

        <hr className="border-purple-500/30" />

        <section>
          <h3 className="text-xl font-semibold text-white mb-4">3. Pricing, Taxes, and Economic Conditions</h3>
          
          <div className="space-y-4">
            <div>
              <p><strong>3.1.</strong> The final price shown to the client includes:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>The accommodation price</li>
                <li>Hotel‑Living's commission</li>
                <li>Estimated taxes (default: 10%)</li>
              </ul>
            </div>

            <div>
              <p><strong>3.2.</strong> Hotel‑Living charges a <strong className="text-yellow-300">fixed commission of 8% on the total final price displayed to the client</strong>.</p>
            </div>

            <div>
              <p><strong>3.3.</strong> The client pays <strong className="text-yellow-300">15% of the total price</strong> at the time of booking.</p>
              <p className="mt-2">This payment is distributed automatically as follows:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li><strong className="text-green-300">8% of total</strong> → Hotel‑Living's commission</li>
                <li><strong className="text-green-300">7% of total</strong> → Non-refundable deposit for the Provider</li>
              </ul>
            </div>

            <div>
              <p><strong>3.4.</strong> The <strong className="text-yellow-300">remaining 85%</strong> of the total price is paid directly by the client to the Provider at check-in or during the stay.</p>
            </div>
          </div>
        </section>

        <hr className="border-purple-500/30" />

        <section>
          <h3 className="text-xl font-semibold text-white mb-4">4. Cancellations</h3>
          <div className="space-y-3">
            <p><strong>4.1.</strong> In case of client cancellation, the advance 15% payment <strong className="text-red-300">will not be refunded</strong>.</p>
            <p><strong>4.2.</strong> The Provider will retain the 7% deposit as compensation.</p>
          </div>
        </section>

        <hr className="border-purple-500/30" />

        <section>
          <h3 className="text-xl font-semibold text-white mb-4">5. Tax Adjustments</h3>
          <div className="space-y-3">
            <p><strong>5.1.</strong> Hotel‑Living applies an estimated tax rate of 10% by default to calculate the final client price.</p>
            <p><strong>5.2.</strong> If the Provider's tax regime differs significantly, they must notify Hotel‑Living in writing before publication. Hotel‑Living will then adjust the pricing and distribution accordingly.</p>
          </div>
        </section>

        <hr className="border-purple-500/30" />

        <section>
          <h3 className="text-xl font-semibold text-white mb-4">6. Invoicing</h3>
          <p>Hotel‑Living issues a monthly invoice to the Provider detailing the reservations and the total amount of deposits transferred.</p>
        </section>

        <hr className="border-purple-500/30" />

        <section>
          <h3 className="text-xl font-semibold text-white mb-4">7. Modifications</h3>
          <p>Hotel‑Living may modify these Terms and Conditions with at least 30 days' notice. If the Provider does not accept the changes, they may request removal from the platform provided there are no pending reservations.</p>
        </section>

        <hr className="border-purple-500/30" />

        <section>
          <h3 className="text-xl font-semibold text-white mb-4">8. Suspension and Termination</h3>
          <p>Hotel‑Living reserves the right to suspend or terminate collaboration with any Provider in case of contractual breach, misconduct, or repeated client complaints.</p>
        </section>
      </div>
    </div>
  );
}
