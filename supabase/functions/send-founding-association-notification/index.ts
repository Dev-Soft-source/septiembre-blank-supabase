import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("send-founding-association-notification function called");
    
    const { associationEmail, associationId, message, timestamp } = await req.json();

    // Initialize Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    console.log("Sending founding association notification for:", associationEmail);

    // Send email notification to JocMathMixado
    const emailResponse = await resend.emails.send({
      from: 'Hotel Living <noreply@hotel-living.com>',
      to: ['jocmathmixado@gmail.com'],
      subject: 'Nueva Asociación Fundadora - Hotel Living',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #7E26A6; padding: 30px; border-radius: 10px; color: white; text-align: center;">
            <h1 style="margin: 0 0 20px 0; font-size: 24px;">Nueva Asociación Fundadora</h1>
            <p style="margin: 0; font-size: 16px;">Una asociación se ha unido como Asociación Fundadora de Hotel Living</p>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #7E26A6; margin-top: 0;">Detalles de la Asociación</h2>
            
            <div style="margin: 20px 0;">
              <p><strong>Email:</strong> ${associationEmail || 'No especificado'}</p>
              <p><strong>ID de Asociación:</strong> ${associationId || 'No especificado'}</p>
              <p><strong>Fecha y Hora:</strong> ${new Date(timestamp).toLocaleString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit',
                timeZone: 'Europe/Madrid'
              })}</p>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #7E26A6; margin-top: 0;">Beneficios de Asociación Fundadora</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Publicidad gratuita en el portal Hotel Living</li>
                <li>Reconocimiento público como entidad fundadora</li>
                <li>Beneficios especiales en el proyecto</li>
                <li>Acceso prioritario a nuevas funcionalidades</li>
              </ul>
            </div>

            <p style="color: #666; font-style: italic; margin-bottom: 0;">
              ${message}
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>Este correo fue generado automáticamente por el sistema Hotel Living</p>
            <p>Timestamp: ${timestamp}</p>
          </div>
        </div>
      `,
    });

    console.log('Founding association notification sent:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully',
        emailId: emailResponse.data?.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-founding-association-notification:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});