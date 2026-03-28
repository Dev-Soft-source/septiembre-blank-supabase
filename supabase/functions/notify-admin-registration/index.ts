import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminNotificationRequest {
  userEmail?: string;
  role?: string;
  userData?: any;
  user?: {
    id: string;
    email: string;
    raw_user_meta_data?: any;
  };
}

// Multilingual email templates for associations
const getAssociationEmailTemplate = (
  userEmail: string, 
  associationName: string, 
  country: string, 
  referralCode: string, 
  responsiblePerson: string,
  language: string = 'es'
) => {
  const translations = {
    es: {
      subject: "Nueva Asociación Registrada - Hotel-living.com",
      title: "Nueva Asociación Registrada",
      subtitle: "Se ha registrado una nueva asociación en la plataforma",
      fields: {
        email: "Email de la asociación",
        name: "Nombre de la asociación", 
        responsible: "Persona responsable",
        country: "País",
        referralCode: "Código de referido",
        status: "Estado",
        date: "Fecha de registro"
      },
      status: "Aprobada automáticamente",
      footer: "Este email se envía automáticamente cuando una asociación completa su registro.<br><strong>El equipo de Hotel-living.com</strong>"
    },
    en: {
      subject: "New Association Registered - Hotel-living.com",
      title: "New Association Registered",
      subtitle: "A new association has registered on the platform",
      fields: {
        email: "Association email",
        name: "Association name",
        responsible: "Responsible person", 
        country: "Country",
        referralCode: "Referral code",
        status: "Status",
        date: "Registration date"
      },
      status: "Automatically approved",
      footer: "This email is sent automatically when an association completes registration.<br><strong>Hotel-living.com Team</strong>"
    },
    pt: {
      subject: "Nova Associação Registrada - Hotel-living.com", 
      title: "Nova Associação Registrada",
      subtitle: "Uma nova associação foi registrada na plataforma",
      fields: {
        email: "Email da associação",
        name: "Nome da associação",
        responsible: "Pessoa responsável",
        country: "País", 
        referralCode: "Código de referência",
        status: "Estado",
        date: "Data de registro"
      },  
      status: "Aprovada automaticamente",
      footer: "Este email é enviado automaticamente quando uma associação conclui o registro.<br><strong>Equipe Hotel-living.com</strong>"
    },
    ro: {
      subject: "Nouă Asociație Înregistrată - Hotel-living.com",
      title: "Nouă Asociație Înregistrată", 
      subtitle: "O nouă asociație s-a înregistrat pe platformă",
      fields: {
        email: "Email-ul asociației",
        name: "Numele asociației",
        responsible: "Persoana responsabilă",
        country: "Țara",
        referralCode: "Cod de recomandare", 
        status: "Statut",
        date: "Data înregistrării"
      },
      status: "Aprobată automat",
      footer: "Acest email este trimis automat când o asociație își finalizează înregistrarea.<br><strong>Echipa Hotel-living.com</strong>"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.es;

  return {
    subject: t.subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${t.title}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7E26A6 0%, #5D0080 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Hotel-living.com</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">${t.subtitle}</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border: 1px solid #ddd;">
            <h2 style="color: #7E26A6; margin-top: 0; font-size: 24px;">${t.title}</h2>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7E26A6;">
              <p style="margin: 8px 0;"><strong style="color: #7E26A6;">${t.fields.email}:</strong> ${userEmail}</p>
              <p style="margin: 8px 0;"><strong style="color: #7E26A6;">${t.fields.name}:</strong> ${associationName}</p>
              <p style="margin: 8px 0;"><strong style="color: #7E26A6;">${t.fields.responsible}:</strong> ${responsiblePerson}</p>
              <p style="margin: 8px 0;"><strong style="color: #7E26A6;">${t.fields.country}:</strong> ${country}</p>
              <p style="margin: 8px 0;"><strong style="color: #7E26A6;">${t.fields.referralCode}:</strong> ${referralCode}</p>
              <p style="margin: 8px 0;"><strong style="color: #7E26A6;">${t.fields.status}:</strong> <span style="color: #28a745; font-weight: bold;">${t.status}</span></p>
              <p style="margin: 8px 0;"><strong style="color: #7E26A6;">${t.fields.date}:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })}</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #7E26A6 0%, #5D0080 100%); padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="color: white; margin: 0; font-size: 14px; font-weight: bold;">
                ✅ ${t.status.toUpperCase()}
              </p>
            </div>
            
            <p style="margin-bottom: 0; font-size: 14px; color: #666; text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
              ${t.footer}
            </p>
          </div>
        </body>
      </html>
    `
  };
};

const getGeneralRegistrationTemplate = (userEmail: string, roleName: string, userData?: any) => {
  return {
    subject: `Nueva Registración Hotel-living.com: ${roleName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Nueva Registración</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #7E26A6 0%, #5D0080 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Hotel-living.com</h1>
            <p style="color: white; margin: 10px 0 0 0;">Nueva Registración</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border: 1px solid #ddd;">
            <h2 style="color: #7E26A6; margin-top: 0;">Nueva registración recibida</h2>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Rol:</strong> ${roleName}</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })}</p>
              ${userData ? `<p><strong>Datos adicionales:</strong><br><pre style="background: #fff; padding: 10px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(userData, null, 2)}</pre></p>` : ''}
            </div>
            
            <p style="margin-bottom: 0; font-size: 14px; color: #666;">
              Este email se envía automáticamente cuando se completa una nueva registración.<br>
              <strong>El equipo de Hotel-living.com</strong>
            </p>
          </div>
        </body>
      </html>
    `
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle GET requests for testing
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ 
        status: "notify-admin-registration function is live", 
        method: "POST",
        expectedBody: { userEmail: "string", role: "string", userData: "object" }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      { 
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  try {
    console.log("notify-admin-registration function called");
    
    const requestData: AdminNotificationRequest = await req.json();
    console.log("Request data received:", { 
      hasUserEmail: !!requestData.userEmail, 
      hasUser: !!requestData.user,
      role: requestData.role || requestData.user?.raw_user_meta_data?.role 
    });
    
    // Handle both old format (direct userEmail/role) and new format (user object)
    const userEmail = requestData.userEmail || requestData.user?.email;
    const role = requestData.role || requestData.user?.raw_user_meta_data?.role;
    const userData = requestData.userData || requestData.user?.raw_user_meta_data;

    if (!userEmail || !role) {
      console.log("Missing required data:", { userEmail: !!userEmail, role: !!role });
      return new Response(
        JSON.stringify({ error: "User email and role are required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Processing admin notification for:", { userEmail, role });

    const adminEmail = "grand_soiree@yahoo.com";
    let emailData;

    // Special handling for association registrations with full multilingual support
    if (role === 'association') {
      const associationName = userData?.association_name || userData?.nombreAsociacion || 'Nombre no disponible';
      const country = userData?.country || 'País no especificado';
      const responsiblePerson = userData?.full_name || userData?.responsible_person || associationName;
      const referralCode = userData?.referral_code || 'Generado automáticamente';
      
      // Detect language based on country or default to Spanish
      let language = 'es';
      if (country.toLowerCase().includes('romania') || country.toLowerCase().includes('rumania')) {
        language = 'ro';
      } else if (country.toLowerCase().includes('brazil') || country.toLowerCase().includes('brasil')) {
        language = 'pt'; 
      } else if (country.toLowerCase().includes('united states') || country.toLowerCase().includes('usa') || country.toLowerCase().includes('united kingdom') || country.toLowerCase().includes('uk')) {
        language = 'en';
      }

      emailData = getAssociationEmailTemplate(userEmail, associationName, country, referralCode, responsiblePerson, language);
    } else {
      // General registration template for other roles
      const roleNames = {
        user: 'Usuario / User',
        traveler: 'Usuario / User',
        hotel: 'Propietario de Hotel / Hotel Owner',
        hotel_owner: 'Propietario de Hotel / Hotel Owner', 
        promoter: 'Promotor / Promoter',
        leaderliving: 'Líder Living / Group Leader',
        leader: 'Líder Living / Group Leader'
      };
      const roleName = roleNames[role as keyof typeof roleNames] || role;
      emailData = getGeneralRegistrationTemplate(userEmail, roleName, userData);
    }

    console.log("Sending admin notification email to:", adminEmail);

    const { data, error } = await resend.emails.send({
      from: "Hotel-living.com <contact@hotel-living.com>",
      to: [adminEmail],
      subject: emailData.subject,
      html: emailData.html,
    });

    if (error) {
      console.error("Error sending admin notification:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("Admin notification sent successfully:", data);
    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error: any) {
    console.error("Error in notify-admin-registration function:", error);
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