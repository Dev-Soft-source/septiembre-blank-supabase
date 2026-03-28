import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { getRegistrationSuccessTemplate, generateEmailHtml, getUserLanguage, type SupportedLanguage } from "../_shared/emailTemplates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  firstName: string;
  isHotelOwner: boolean;
  language: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, isHotelOwner, language }: WelcomeEmailRequest = await req.json();

    // Use the new multi-language template system
    const userLanguage = getUserLanguage(language);
    const emailContent = getRegistrationSuccessTemplate(userLanguage);
    
    // Customize greeting with user's name if provided
    if (firstName) {
      const greetings = {
        es: `¡Hola ${firstName}!`,
        en: `Hello ${firstName}!`,
        pt: `Olá ${firstName}!`,
        ro: `Salut ${firstName}!`
      };
      emailContent.greeting = greetings[userLanguage] || greetings.en;
    }
    
    // Add context-specific content for hotel owners vs regular users
    if (isHotelOwner) {
      const hotelContent = {
        es: `
          <p>Tu registro como socio hotelero se ha completado correctamente.</p>
          <p>Ya puedes acceder a tu panel de gestión hotelera y comenzar a recibir huéspedes de larga estancia.</p>
        `,
        en: `
          <p>Your registration as a hotel partner was successful.</p>
          <p>You can now access your hotel management dashboard and start receiving long-stay guests.</p>
        `,
        pt: `
          <p>Seu registro como parceiro hoteleiro foi concluído com sucesso.</p>
          <p>Agora você pode acessar seu painel de gestão hoteleira e começar a receber hóspedes de longa estadia.</p>
        `,
        ro: `
          <p>Înregistrarea ta ca partener hotelier a fost finalizată cu succes.</p>
          <p>Acum poți accesa panoul tău de management hotelier și începe să primești oaspeți pentru șederi îndelungate.</p>
        `
      };
      emailContent.content = hotelContent[userLanguage] || hotelContent.en;
    }

    const html = generateEmailHtml(emailContent);

    const { data, error } = await resend.emails.send({
      from: "Hotel Living <contact@hotel-living.com>", // Updated to use verified domain
      to: [email],
      subject: emailContent.subject,
      html: html,
    });

    if (error) {
      console.error("Error sending welcome email:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Welcome email sent successfully:", data);
    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);