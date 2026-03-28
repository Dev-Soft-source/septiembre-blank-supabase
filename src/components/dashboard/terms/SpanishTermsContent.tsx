
import React from "react";

export function SpanishTermsContent() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4">TÉRMINOS Y CONDICIONES – HOTEL‑LIVING (PARA PROPIETARIOS)</h2>
      
      <div className="space-y-5 text-gray-200">
        <section>
          <h3 className="text-sm sm:text-base font-semibold text-white mb-3">1. Objeto y alcance</h3>
          <p className="text-xs sm:text-sm leading-relaxed">
            Los presentes Términos y Condiciones regulan la relación entre el proveedor de alojamiento (en adelante, el "Proveedor") y la plataforma Hotel‑Living, para la publicación y comercialización de estancias temáticas de media duración.
          </p>
        </section>

        <hr className="border-purple-500/30" />

        <section>
          <h3 className="text-sm sm:text-base font-semibold text-white mb-3">2. Obligaciones</h3>
          
          <div className="mb-4">
            <h4 className="text-xs sm:text-sm font-medium text-white mb-2">2.1. Obligaciones del Proveedor</h4>
            <p className="text-xs sm:text-sm mb-2">El Proveedor se compromete a:</p>
            <ul className="list-disc list-inside space-y-1 ml-3 text-xs sm:text-sm">
              <li>Publicar información veraz y actualizada de su alojamiento.</li>
              <li>Cumplir con la normativa local vigente, incluyendo legislación fiscal, sanitaria y turística.</li>
              <li>Mantener los estándares de calidad exigidos por Hotel‑Living.</li>
              <li>Gestionar con diligencia las reservas y cobros recibidos del cliente.</li>
              <li>Informar a Hotel‑Living si su régimen fiscal difiere significativamente del estándar aplicado (10%).</li>
              <li>Asumir la <strong className="text-yellow-300">plena responsabilidad por la relación directa con el cliente</strong>, incluyendo el cumplimiento del servicio contratado, la gestión de cancelaciones, reclamaciones o incidencias surgidas durante la estancia.</li>
              <li>Reconocer que <strong className="text-yellow-300">Hotel‑Living actúa exclusivamente como plataforma de intermediación</strong>, sin intervenir en la prestación efectiva del servicio de alojamiento. Cualquier disputa legal, contractual o de consumo entre cliente y establecimiento deberá resolverse entre ambas partes conforme a la legislación vigente.</li>
              <li>No obstante, <strong className="text-yellow-300">Hotel‑Living podrá ofrecer mecanismos de mediación amistosa</strong>, si ambas partes lo solicitan expresamente, sin que ello implique asumir responsabilidad alguna.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs sm:text-sm font-medium text-white mb-2">2.2. Obligaciones de Hotel‑Living</h4>
            <p className="text-xs sm:text-sm mb-2">Hotel‑Living se compromete a:</p>
            <ul className="list-disc list-inside space-y-1 ml-3 text-xs sm:text-sm">
              <li>Mostrar de forma clara y transparente el precio total al cliente, incluyendo impuestos estimados.</li>
              <li>Aplicar al cliente un cobro anticipado del 15% sobre el precio total, del cual el 7% se transferirá al Proveedor como depósito no reembolsable.</li>
              <li>Transferir mensualmente al Proveedor los depósitos acumulados correspondientes a reservas confirmadas.</li>
              <li>Emitir facturas mensuales con detalle de las reservas gestionadas y los importes liquidados.</li>
              <li>Atender con diligencia cualquier comunicación del Proveedor relativa a su cuenta, reservas o ajustes fiscales.</li>
              <li>No modificar unilateralmente las condiciones económicas sin previo aviso y sin posibilidad de baja voluntaria por parte del Proveedor.</li>
            </ul>
          </div>
        </section>

        <hr className="border-purple-500/30" />

        <section>
          <h3 className="text-sm sm:text-base font-semibold text-white mb-3">3. Precios, impuestos y condiciones económicas</h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs sm:text-sm"><strong>3.1.</strong> El precio final mostrado al cliente en la plataforma incluye:</p>
              <ul className="list-disc list-inside space-y-1 ml-3 mt-1 text-xs sm:text-sm">
                <li>El precio del alojamiento</li>
                <li>La comisión de Hotel‑Living</li>
                <li>Impuestos estimados (por defecto, un 10%)</li>
              </ul>
            </div>

            <div>
              <p className="text-xs sm:text-sm"><strong>3.2.</strong> Hotel‑Living cobra una <strong className="text-yellow-300">comisión fija del 8% sobre el precio total final mostrado al cliente</strong>.</p>
            </div>

            <div>
              <p className="text-xs sm:text-sm"><strong>3.3.</strong> El cliente paga <strong className="text-yellow-300">el 15% del precio total</strong> al momento de realizar la reserva.</p>
              <p className="text-xs sm:text-sm mt-1">Este pago anticipado se distribuye automáticamente así:</p>
              <ul className="list-disc list-inside space-y-1 ml-3 mt-1 text-xs sm:text-sm">
                <li><strong className="text-green-300">8% del total</strong> → Comisión de Hotel‑Living</li>
                <li><strong className="text-green-300">7% del total</strong> → Depósito no reembolsable transferido al Proveedor</li>
              </ul>
            </div>

            <div>
              <p className="text-xs sm:text-sm"><strong>3.4.</strong> El <strong className="text-yellow-300">85% restante</strong> del precio total será pagado directamente por el cliente al alojamiento al momento del check-in o durante su estancia.</p>
            </div>
          </div>
        </section>

        <hr className="border-purple-500/30" />

        <section>
          <h3 className="text-sm sm:text-base font-semibold text-white mb-3">4. Cancelaciones</h3>
          <div className="space-y-2">
            <p className="text-xs sm:text-sm"><strong>4.1.</strong> En caso de cancelación por parte del cliente, el pago anticipado del 15% <strong className="text-red-300">no será reembolsado</strong>.</p>
            <p className="text-xs sm:text-sm"><strong>4.2.</strong> El depósito del 7% será conservado por el hotel como compensación.</p>
          </div>
        </section>

        <hr className="border-purple-500/30" />

        <section>
          <h3 className="text-sm sm:text-base font-semibold text-white mb-3">5. Ajustes fiscales</h3>
          <div className="space-y-2">
            <p className="text-xs sm:text-sm"><strong>5.1.</strong> Hotel‑Living aplica, por defecto, un tipo estimado del 10% de impuestos para calcular el precio final al cliente.</p>
            <p className="text-xs sm:text-sm"><strong>5.2.</strong> Si el régimen fiscal del Proveedor difiere sustancialmente, este deberá comunicarlo por escrito antes de la publicación. Hotel‑Living ajustará entonces los precios y el reparto correspondiente.</p>
          </div>
        </section>

        <hr className="border-purple-500/30" />

        <section>
          <h3 className="text-sm sm:text-base font-semibold text-white mb-3">6. Facturación</h3>
          <p className="text-xs sm:text-sm">Hotel‑Living emite mensualmente una factura al Proveedor con el detalle de las reservas y la suma total de los depósitos transferidos.</p>
        </section>

        <hr className="border-purple-500/30" />

        <section>
          <h3 className="text-sm sm:text-base font-semibold text-white mb-3">7. Modificaciones</h3>
          <p className="text-xs sm:text-sm">Hotel‑Living podrá modificar estos Términos y Condiciones notificando al Proveedor con al menos 30 días de antelación. Si el Proveedor no acepta los cambios, podrá solicitar la baja siempre que no tenga reservas pendientes.</p>
        </section>

        <hr className="border-purple-500/30" />

        <section>
          <h3 className="text-sm sm:text-base font-semibold text-white mb-3">8. Suspensión y cancelación</h3>
          <p className="text-xs sm:text-sm">Hotel‑Living se reserva el derecho de suspender o cancelar la colaboración con cualquier Proveedor en caso de incumplimiento, mala praxis o quejas recurrentes por parte de los clientes.</p>
        </section>
      </div>
    </div>
  );
}
