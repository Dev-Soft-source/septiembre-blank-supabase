export type SupportedLanguage = 'en' | 'es' | 'pt' | 'ro';

export interface EmailTemplate {
  subject: string;
  title: string;
  greeting: string;
  body: string;
  buttonText: string;
  disclaimer: string;
  signature: string;
}

export const getUserLanguage = (language?: string): SupportedLanguage => {
  if (!language) return 'en';
  const lang = language.toLowerCase().slice(0, 2);
  return ['es', 'pt', 'ro'].includes(lang) ? lang as SupportedLanguage : 'en';
};

// Email confirmation templates (for signup verification)
export const getEmailConfirmationTemplate = (language: SupportedLanguage, confirmationUrl: string): EmailTemplate => {
  const templates: Record<SupportedLanguage, EmailTemplate> = {
    en: {
      subject: "Confirm your signup – Hotel-living.com",
      title: "Welcome to Hotel-living.com!",
      greeting: "Thank you for registering with us.",
      body: "Please confirm your email address by clicking the button below:",
      buttonText: "Confirm Email Address",
      disclaimer: "If you didn't create an account with us, you can safely ignore this email.",
      signature: "Best regards,<br>Hotel-living.com Team"
    },
    es: {
      subject: "Confirma tu registro – Hotel-living.com",
      title: "¡Bienvenido a Hotel-living.com!",
      greeting: "Gracias por registrarte con nosotros.",
      body: "Por favor confirma tu dirección de correo electrónico haciendo clic en el botón de abajo:",
      buttonText: "Confirmar Dirección de Email",
      disclaimer: "Si no creaste una cuenta con nosotros, puedes ignorar este correo de forma segura.",
      signature: "Saludos cordiales,<br>El equipo de Hotel-living.com"
    },
    pt: {
      subject: "Confirme seu registro – Hotel-living.com",
      title: "Bem-vindo ao Hotel-living.com!",
      greeting: "Obrigado por se registrar conosco.",
      body: "Por favor confirme seu endereço de e-mail clicando no botão abaixo:",
      buttonText: "Confirmar Endereço de Email",
      disclaimer: "Se você não criou uma conta conosco, pode ignorar este e-mail com segurança.",
      signature: "Atenciosamente,<br>Equipe Hotel-living.com"
    },
    ro: {
      subject: "Confirmați înregistrarea – Hotel-living.com",
      title: "Bun venit la Hotel-living.com!",
      greeting: "Vă mulțumim că v-ați înregistrat la noi.",
      body: "Vă rugăm să confirmați adresa dvs. de e-mail făcând clic pe butonul de mai jos:",
      buttonText: "Confirmați Adresa de Email",
      disclaimer: "Dacă nu ați creat un cont la noi, puteți ignora în siguranță acest e-mail.",
      signature: "Cu stimă,<br>Echipa Hotel-living.com"
    }
  };
  return { ...templates[language], confirmationUrl } as EmailTemplate & { confirmationUrl: string };
};

// Password recovery templates
export const getPasswordRecoveryTemplate = (language: SupportedLanguage, resetUrl: string): EmailTemplate => {
  const templates: Record<SupportedLanguage, EmailTemplate> = {
    en: {
      subject: "Password Reset – Hotel-living.com",
      title: "Password Reset Request",
      greeting: "We received a request to reset your password.",
      body: "Click the button below to reset it:",
      buttonText: "Reset Password",
      disclaimer: "If you didn't request a password reset, you can safely ignore this email.",
      signature: "Best regards,<br>Hotel-living.com Team"
    },
    es: {
      subject: "Restablecimiento de contraseña – Hotel-living.com",
      title: "Solicitud de restablecimiento de contraseña",
      greeting: "Recibimos una solicitud para restablecer tu contraseña.",
      body: "Haz clic en el botón de abajo para restablecerla:",
      buttonText: "Restablecer Contraseña",
      disclaimer: "Si no solicitaste un restablecimiento de contraseña, puedes ignorar este correo de forma segura.",
      signature: "Saludos cordiales,<br>El equipo de Hotel-living.com"
    },
    pt: {
      subject: "Redefinição de senha – Hotel-living.com",
      title: "Solicitação de redefinição de senha",
      greeting: "Recebemos uma solicitação para redefinir sua senha.",
      body: "Clique no botão abaixo para redefini-la:",
      buttonText: "Redefinir Senha",
      disclaimer: "Se você não solicitou uma redefinição de senha, pode ignorar este e-mail com segurança.",
      signature: "Atenciosamente,<br>Equipe Hotel-living.com"
    },
    ro: {
      subject: "Resetarea parolei – Hotel-living.com",
      title: "Cerere de resetare parolă",
      greeting: "Am primit o cerere pentru resetarea parolei dvs.",
      body: "Faceți clic pe butonul de mai jos pentru a o reseta:",
      buttonText: "Resetați Parola",
      disclaimer: "Dacă nu ați solicitat resetarea parolei, puteți ignora în siguranță acest e-mail.",
      signature: "Cu stimă,<br>Echipa Hotel-living.com"
    }
  };
  return { ...templates[language], resetUrl } as EmailTemplate & { resetUrl: string };
};

// Magic link templates
export const getMagicLinkTemplate = (language: SupportedLanguage, magicUrl: string): EmailTemplate => {
  const templates: Record<SupportedLanguage, EmailTemplate> = {
    en: {
      subject: "Your magic link – Hotel-living.com",
      title: "Your Magic Link",
      greeting: "Click the button below to sign in to your Hotel-living.com account:",
      body: "",
      buttonText: "Sign In",
      disclaimer: "If you didn't request this link, you can safely ignore this email.",
      signature: "Best regards,<br>Hotel-living.com Team"
    },
    es: {
      subject: "Tu enlace mágico – Hotel-living.com",
      title: "Tu Enlace Mágico",
      greeting: "Haz clic en el botón de abajo para iniciar sesión en tu cuenta de Hotel-living.com:",
      body: "",
      buttonText: "Iniciar Sesión",
      disclaimer: "Si no solicitaste este enlace, puedes ignorar este correo de forma segura.",
      signature: "Saludos cordiales,<br>El equipo de Hotel-living.com"
    },
    pt: {
      subject: "Seu link mágico – Hotel-living.com",
      title: "Seu Link Mágico",
      greeting: "Clique no botão abaixo para fazer login na sua conta Hotel-living.com:",
      body: "",
      buttonText: "Fazer Login",
      disclaimer: "Se você não solicitou este link, pode ignorar este e-mail com segurança.",
      signature: "Atenciosamente,<br>Equipe Hotel-living.com"
    },
    ro: {
      subject: "Link-ul dvs. magic – Hotel-living.com",
      title: "Link-ul Dvs. Magic",
      greeting: "Faceți clic pe butonul de mai jos pentru a vă conecta la contul dvs. Hotel-living.com:",
      body: "",
      buttonText: "Conectați-vă",
      disclaimer: "Dacă nu ați solicitat acest link, puteți ignora în siguranță acest e-mail.",
      signature: "Cu stimă,<br>Echipa Hotel-living.com"
    }
  };
  return { ...templates[language], magicUrl } as EmailTemplate & { magicUrl: string };
};

// Email change confirmation templates
export const getEmailChangeTemplate = (language: SupportedLanguage, confirmationUrl: string): EmailTemplate => {
  const templates: Record<SupportedLanguage, EmailTemplate> = {
    en: {
      subject: "Confirm email change – Hotel-living.com",
      title: "Confirm Email Change",
      greeting: "Please confirm your new email address by clicking the button below:",
      body: "",
      buttonText: "Confirm New Email",
      disclaimer: "If you didn't request this change, please contact our support team immediately.",
      signature: "Best regards,<br>Hotel-living.com Team"
    },
    es: {
      subject: "Confirmar cambio de email – Hotel-living.com",
      title: "Confirmar Cambio de Email",
      greeting: "Por favor confirma tu nueva dirección de correo electrónico haciendo clic en el botón de abajo:",
      body: "",
      buttonText: "Confirmar Nuevo Email",
      disclaimer: "Si no solicitaste este cambio, por favor contacta a nuestro equipo de soporte inmediatamente.",
      signature: "Saludos cordiales,<br>El equipo de Hotel-living.com"
    },
    pt: {
      subject: "Confirmar alteração de e-mail – Hotel-living.com",
      title: "Confirmar Alteração de E-mail",
      greeting: "Por favor confirme seu novo endereço de e-mail clicando no botão abaixo:",
      body: "",
      buttonText: "Confirmar Novo E-mail",
      disclaimer: "Se você não solicitou esta alteração, entre em contato com nossa equipe de suporte imediatamente.",
      signature: "Atenciosamente,<br>Equipe Hotel-living.com"
    },
    ro: {
      subject: "Confirmați schimbarea e-mailului – Hotel-living.com",
      title: "Confirmați Schimbarea E-mailului",
      greeting: "Vă rugăm să confirmați noua dvs. adresă de e-mail făcând clic pe butonul de mai jos:",
      body: "",
      buttonText: "Confirmați Noul E-mail",
      disclaimer: "Dacă nu ați solicitat această schimbare, vă rugăm să contactați echipa noastră de suport imediat.",
      signature: "Cu stimă,<br>Echipa Hotel-living.com"
    }
  };
  return { ...templates[language], confirmationUrl } as EmailTemplate & { confirmationUrl: string };
};

// Invitation templates
export const getInvitationTemplate = (language: SupportedLanguage, invitationUrl: string): EmailTemplate => {
  const templates: Record<SupportedLanguage, EmailTemplate> = {
    en: {
      subject: "You're invited to Hotel-living.com",
      title: "You've been invited!",
      greeting: "You have been invited to join Hotel-living.com.",
      body: "Click the button below to accept the invitation and create your account:",
      buttonText: "Accept Invitation",
      disclaimer: "If you didn't expect this invitation, you can safely ignore this email.",
      signature: "Best regards,<br>Hotel-living.com Team"
    },
    es: {
      subject: "Estás invitado a Hotel-living.com",
      title: "¡Has sido invitado!",
      greeting: "Has sido invitado a unirte a Hotel-living.com.",
      body: "Haz clic en el botón de abajo para aceptar la invitación y crear tu cuenta:",
      buttonText: "Aceptar Invitación",
      disclaimer: "Si no esperabas esta invitación, puedes ignorar este correo de forma segura.",
      signature: "Saludos cordiales,<br>El equipo de Hotel-living.com"
    },
    pt: {
      subject: "Você foi convidado para Hotel-living.com",
      title: "Você foi convidado!",
      greeting: "Você foi convidado para se juntar ao Hotel-living.com.",
      body: "Clique no botão abaixo para aceitar o convite e criar sua conta:",
      buttonText: "Aceitar Convite",
      disclaimer: "Se você não esperava este convite, pode ignorar este e-mail com segurança.",
      signature: "Atenciosamente,<br>Equipe Hotel-living.com"
    },
    ro: {
      subject: "Sunteți invitat la Hotel-living.com",
      title: "Ați fost invitat!",
      greeting: "Ați fost invitat să vă alăturați Hotel-living.com.",
      body: "Faceți clic pe butonul de mai jos pentru a accepta invitația și a vă crea contul:",
      buttonText: "Acceptați Invitația",
      disclaimer: "Dacă nu v-ați așteptat la această invitație, puteți ignora în siguranță acest e-mail.",
      signature: "Cu stimă,<br>Echipa Hotel-living.com"
    }
  };
  return { ...templates[language], invitationUrl } as EmailTemplate & { invitationUrl: string };
};

// Generate HTML email from template
export const generateEmailHtml = (emailContent: EmailTemplate & { confirmationUrl?: string; resetUrl?: string; magicUrl?: string; invitationUrl?: string }): string => {
  const actionUrl = emailContent.confirmationUrl || emailContent.resetUrl || emailContent.magicUrl || emailContent.invitationUrl || '#';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${emailContent.subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #7E26A6; color: white; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; font-size: 28px; margin: 0;">Hotel-living.com</h1>
        </div>
        <div style="background-color: white; color: #333; padding: 30px; border-radius: 10px;">
          <h2 style="color: #7E26A6; margin-top: 0;">${emailContent.title}</h2>
          <p>${emailContent.greeting}</p>
          ${emailContent.body ? `<p>${emailContent.body}</p>` : ''}
          <div style="text-align: center; margin: 30px 0;">
            <a href="${actionUrl}" style="background-color: #7E26A6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">${emailContent.buttonText}</a>
          </div>
          <p>${emailContent.disclaimer}</p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
            <p>${emailContent.signature}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};