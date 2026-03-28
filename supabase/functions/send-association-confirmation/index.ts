
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { Resend } from "npm:resend@2.0.0";
import { getRegistrationSuccessTemplate, generateEmailHtml, getUserLanguage, type SupportedLanguage } from "../_shared/emailTemplates.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("Association confirmation email function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { associationData } = await req.json();
    console.log("Received association data:", associationData);

    if (!associationData || !associationData.email) {
      console.error("Missing association data or email");
      return new Response(
        JSON.stringify({ error: "Missing association data or email" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Update user's preferred language in the database if provided
    if (associationData.language) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );
      
      try {
        // Find user by email to update their language preference
        const { data: users } = await supabase.auth.admin.listUsers();
        const user = users?.users?.find(u => u.email === associationData.email);
        
        if (user) {
          // Update profiles table with language preference
          await supabase
            .from('profiles')
            .update({ preferred_language: associationData.language })
            .eq('id', user.id);
          
          console.log(`Updated language preference for user ${user.id} to ${associationData.language}`);
        }
      } catch (error) {
        console.error("Error updating language preference:", error);
        // Don't fail the email sending if language update fails
      }
    }

    // Get user language preference (default to Spanish for associations)
    const userLanguage = getUserLanguage(associationData.language || 'es');
    
    // Create custom email content for association confirmation
    const getAssociationConfirmationTemplate = (lang: SupportedLanguage, associationData: any) => {
      const templates = {
        es: {
          subject: "Confirmación de Registro - Hotel-Living Asociación",
          greeting: `Estimado/a ${associationData.responsibleName},`,
          content: `
            <p>Su registro como asociación en Hotel-Living ha sido recibido exitosamente.</p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #ddd;">
              <h3 style="color: #667eea; margin-top: 0;">Detalles del Registro:</h3>
              <p><strong>Nombre de la Asociación:</strong> ${associationData.name}</p>
              <p><strong>Responsable:</strong> ${associationData.responsibleName}</p>
              <p><strong>Email:</strong> ${associationData.email}</p>
              <p><strong>País:</strong> ${associationData.country}</p>
            </div>
            <p>Su solicitud está siendo revisada por nuestro equipo. Le contactaremos pronto con más información sobre los próximos pasos.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://hotel-living.com/panel-asociacion" 
                 style="background-color: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Acceder al Panel de Asociación
              </a>
            </div>
          `,
          signature: "El equipo de Hotel-living.com"
        },
        en: {
          subject: "Registration Confirmation - Hotel-Living Association",
          greeting: `Dear ${associationData.responsibleName},`,
          content: `
            <p>Your association registration with Hotel-Living has been successfully received.</p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #ddd;">
              <h3 style="color: #667eea; margin-top: 0;">Registration Details:</h3>
              <p><strong>Association Name:</strong> ${associationData.name}</p>
              <p><strong>Responsible Person:</strong> ${associationData.responsibleName}</p>
              <p><strong>Email:</strong> ${associationData.email}</p>
              <p><strong>Country:</strong> ${associationData.country}</p>
            </div>
            <p>Your application is being reviewed by our team. We will contact you soon with more information about the next steps.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://hotel-living.com/panel-asociacion" 
                 style="background-color: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Access Association Panel
              </a>
            </div>
          `,
          signature: "El equipo de Hotel-living.com"
        },
        pt: {
          subject: "Confirmação de Registro - Associação Hotel-Living",
          greeting: `Prezado/a ${associationData.responsibleName},`,
          content: `
            <p>Seu registro como associação no Hotel-Living foi recebido com sucesso.</p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #ddd;">
              <h3 style="color: #667eea; margin-top: 0;">Detalhes do Registro:</h3>
              <p><strong>Nome da Associação:</strong> ${associationData.name}</p>
              <p><strong>Responsável:</strong> ${associationData.responsibleName}</p>
              <p><strong>Email:</strong> ${associationData.email}</p>
              <p><strong>País:</strong> ${associationData.country}</p>
            </div>
            <p>Sua solicitação está sendo revisada por nossa equipe. Entraremos em contato em breve com mais informações sobre os próximos passos.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://hotel-living.com/panel-asociacion" 
                 style="background-color: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Acessar Painel da Associação
              </a>
            </div>
          `,
          signature: "El equipo de Hotel-living.com"
        },
        ro: {
          subject: "Confirmare Înregistrare - Asociația Hotel-Living",
          greeting: `Stimate ${associationData.responsibleName},`,
          content: `
            <p>Înregistrarea dvs. ca asociație la Hotel-Living a fost primită cu succes.</p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #ddd;">
              <h3 style="color: #667eea; margin-top: 0;">Detaliile Înregistrării:</h3>
              <p><strong>Numele Asociației:</strong> ${associationData.name}</p>
              <p><strong>Persoana Responsabilă:</strong> ${associationData.responsibleName}</p>
              <p><strong>Email:</strong> ${associationData.email}</p>
              <p><strong>Țara:</strong> ${associationData.country}</p>
            </div>
            <p>Cererea dvs. este în curs de examinare de către echipa noastră. Vă vom contacta în curând cu mai multe informații despre pașii următori.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://hotel-living.com/panel-asociacion" 
                 style="background-color: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Accesați Panoul Asociației
              </a>
            </div>
          `,
          signature: "El equipo de Hotel-living.com"
        }
      };
      return templates[lang] || templates.es;
    };

    const emailContent = getAssociationConfirmationTemplate(userLanguage, associationData);
    const html = generateEmailHtml(emailContent);

    const emailData = {
      from: "Hotel Living <contact@hotel-living.com>", // Updated to use verified domain
      to: [associationData.email],
      subject: emailContent.subject,
      html: html,
    };

    console.log("Attempting to send email with data:", emailData);
    
    const emailResponse = await resend.emails.send(emailData);
    
    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      throw new Error(`Email sending failed: ${JSON.stringify(emailResponse.error)}`);
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data?.id,
        message: "Confirmation email sent successfully" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Error in send-association-confirmation function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send confirmation email",
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
