import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BrandedEmailRequest {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
  language?: 'en' | 'es' | 'pt' | 'ro';
}

const getEmailTemplate = (template: string, language: string = 'en', data: Record<string, any>) => {
  const templates = {
    'email_confirmation': {
      'en': {
        subject: 'Confirm your signup – Hotel-living.com',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #7E26A6; color: white; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; font-size: 28px; margin: 0;">Hotel-living.com</h1>
            </div>
            <div style="background-color: white; color: #333; padding: 30px; border-radius: 10px;">
              <h2 style="color: #7E26A6; margin-top: 0;">Welcome to Hotel-living.com!</h2>
              <p>Thank you for registering with us. Please confirm your email address by clicking the button below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.confirmationUrl}" style="background-color: #7E26A6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Confirm Email Address</a>
              </div>
              <p>If you didn't create an account with us, you can safely ignore this email.</p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                <p>Best regards,<br>El equipo de Hotel-living.com</p>
              </div>
            </div>
          </div>
        `
      },
      'es': {
        subject: 'Confirma tu registro – Hotel-living.com',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #7E26A6; color: white; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; font-size: 28px; margin: 0;">Hotel-living.com</h1>
            </div>
            <div style="background-color: white; color: #333; padding: 30px; border-radius: 10px;">
              <h2 style="color: #7E26A6; margin-top: 0;">¡Bienvenido a Hotel-living.com!</h2>
              <p>Gracias por registrarte con nosotros. Por favor confirma tu dirección de correo electrónico haciendo clic en el botón de abajo:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.confirmationUrl}" style="background-color: #7E26A6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Confirmar Dirección de Email</a>
              </div>
              <p>Si no creaste una cuenta con nosotros, puedes ignorar este correo de forma segura.</p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                <p>Saludos cordiales,<br>El equipo de Hotel-living.com</p>
              </div>
            </div>
          </div>
        `
      },
      'pt': {
        subject: 'Confirme seu cadastro – Hotel-living.com',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #7E26A6; color: white; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; font-size: 28px; margin: 0;">Hotel-living.com</h1>
            </div>
            <div style="background-color: white; color: #333; padding: 30px; border-radius: 10px;">
              <h2 style="color: #7E26A6; margin-top: 0;">Bem-vindo ao Hotel-living.com!</h2>
              <p>Obrigado por se registrar conosco. Por favor confirme seu endereço de email clicando no botão abaixo:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.confirmationUrl}" style="background-color: #7E26A6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Confirmar Endereço de Email</a>
              </div>
              <p>Se você não criou uma conta conosco, pode ignorar este email com segurança.</p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                <p>Melhores cumprimentos,<br>El equipo de Hotel-living.com</p>
              </div>
            </div>
          </div>
        `
      },
      'ro': {
        subject: 'Confirmați înregistrarea – Hotel-living.com',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #7E26A6; color: white; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; font-size: 28px; margin: 0;">Hotel-living.com</h1>
            </div>
            <div style="background-color: white; color: #333; padding: 30px; border-radius: 10px;">
              <h2 style="color: #7E26A6; margin-top: 0;">Bun venit la Hotel-living.com!</h2>
              <p>Vă mulțumim că v-ați înregistrat la noi. Vă rugăm să confirmați adresa de email făcând clic pe butonul de mai jos:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.confirmationUrl}" style="background-color: #7E26A6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Confirmați Adresa de Email</a>
              </div>
              <p>Dacă nu ați creat un cont la noi, puteți ignora în siguranță acest email.</p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                <p>Cu stimă,<br>El equipo de Hotel-living.com</p>
              </div>
            </div>
          </div>
        `
      }
    },
    'password_reset': {
      'en': {
        subject: 'Reset your password – Hotel-living.com',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #7E26A6; color: white; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; font-size: 28px; margin: 0;">Hotel-living.com</h1>
            </div>
            <div style="background-color: white; color: #333; padding: 30px; border-radius: 10px;">
              <h2 style="color: #7E26A6; margin-top: 0;">Password Reset Request</h2>
              <p>We received a request to reset your password. Click the button below to reset it:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.resetUrl}" style="background-color: #7E26A6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
              </div>
              <p>If you didn't request a password reset, you can safely ignore this email.</p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                <p>Best regards,<br>El equipo de Hotel-living.com</p>
              </div>
            </div>
          </div>
        `
      },
      'es': {
        subject: 'Restablece tu contraseña – Hotel-living.com',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #7E26A6; color: white; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; font-size: 28px; margin: 0;">Hotel-living.com</h1>
            </div>
            <div style="background-color: white; color: #333; padding: 30px; border-radius: 10px;">
              <h2 style="color: #7E26A6; margin-top: 0;">Solicitud de Restablecimiento de Contraseña</h2>
              <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para restablecerla:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.resetUrl}" style="background-color: #7E26A6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Restablecer Contraseña</a>
              </div>
              <p>Si no solicitaste un restablecimiento de contraseña, puedes ignorar este correo de forma segura.</p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                <p>Saludos cordiales,<br>El equipo de Hotel-living.com</p>
              </div>
            </div>
          </div>
        `
      },
      'pt': {
        subject: 'Redefina sua senha – Hotel-living.com',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #7E26A6; color: white; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; font-size: 28px; margin: 0;">Hotel-living.com</h1>
            </div>
            <div style="background-color: white; color: #333; padding: 30px; border-radius: 10px;">
              <h2 style="color: #7E26A6; margin-top: 0;">Solicitação de Redefinição de Senha</h2>
              <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para redefini-la:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.resetUrl}" style="background-color: #7E26A6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Redefinir Senha</a>
              </div>
              <p>Se você não solicitou uma redefinição de senha, pode ignorar este email com segurança.</p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                <p>Melhores cumprimentos,<br>El equipo de Hotel-living.com</p>
              </div>
            </div>
          </div>
        `
      },
      'ro': {
        subject: 'Resetați parola – Hotel-living.com',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #7E26A6; color: white; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: white; font-size: 28px; margin: 0;">Hotel-living.com</h1>
            </div>
            <div style="background-color: white; color: #333; padding: 30px; border-radius: 10px;">
              <h2 style="color: #7E26A6; margin-top: 0;">Cerere de Resetare Parolă</h2>
              <p>Am primit o cerere de resetare a parolei. Faceți clic pe butonul de mai jos pentru a o reseta:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.resetUrl}" style="background-color: #7E26A6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Resetați Parola</a>
              </div>
              <p>Dacă nu ați solicitat o resetare a parolei, puteți ignora în siguranță acest email.</p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                <p>Cu stimă,<br>El equipo de Hotel-living.com</p>
              </div>
            </div>
          </div>
        `
      }
    }
  };

  const templateData = templates[template as keyof typeof templates];
  if (!templateData) {
    throw new Error(`Template ${template} not found`);
  }

  const languageTemplate = templateData[language as keyof typeof templateData];
  if (!languageTemplate) {
    // Fallback to English if language not found
    return templateData['en' as keyof typeof templateData];
  }

  return languageTemplate;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, template, data, language = 'en' }: BrandedEmailRequest = await req.json();

    console.log(`Sending branded email to ${to} using template ${template} in ${language}`);

    const emailTemplate = getEmailTemplate(template, language, data);

    const { data: result, error } = await resend.emails.send({
      from: "Hotel-living.com <onboarding@resend.dev>",
      to: [to],
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Email sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error sending branded email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});