import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTranslation } from "@/hooks/useTranslation";
import { HotelStarfield } from "@/components/hotels/HotelStarfield";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Mail, MapPin, Calendar, FileText, Users } from "lucide-react";

export default function ProfessionalStudy() {
  const { t, language } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log("Professional study request submitted");
  };

  const getContent = () => {
    switch (language) {
      case 'es':
        return {
          title: "ESTUDIO GRATUITO",
          subtitle: "Obtenga un completo estudio técnico\ny presencial sobre su hotel y sus posibilidades de desarrollo",
          description: "Una oportunidad única para analizar su hotel desde una nueva perspectiva\n\nEn el marco de nuestro programa de expansión, y en colaboración con la firma Bridgepoint Global Consulting, especializada en análisis técnico y consultoría hotelera, ofrecemos la posibilidad única de realizar un estudio integral y personalizado de su establecimiento, completamente in situ.\n\nESTA CONSULTORÍA INCLUYE:\n• ✅ Un estudio de mercado contextualizado con datos reales de su entorno y competidores\n• ✅ Análisis SWOT, benchmarking, proyecciones de rentabilidad y plan de acción inicial\n• ✅ Diagnóstico de fortalezas, debilidades y elementos diferenciadores\n• ✅ Recomendaciones para su integración en el modelo Hotel-Living\n• ✅ Informe técnico completo, con métricas, estrategias y observaciones detalladas\n• ✅ En caso de que el establecimiento cumpla con estándares básicos de atractivo, se realizará un reportaje audiovisual, que será incorporado en la sección de \"Hoteles Recomendados\" del portal, con visibilidad destacada durante un periodo de seis meses.\n\nAdemás, durante la visita, le presentaremos un análisis de las nuevas tendencias en soluciones habitacionales, como el co-living, el housing as a service o los modelos temáticos de larga estancia. Este contexto le permitirá evaluar con mayor claridad su potencial dentro de una transformación global en el sector alojamiento.\n\n________________________________________\n\nDURACIÓN Y COSTE\n\nSe trata de una visita presencial de 5 a 7 días, realizada por dos especialistas de nuestro equipo.\n\nNo existe ningún coste por el estudio ni la elaboración del informe.\n\nÚnicamente se solicitará la cobertura de los gastos básicos de viaje y estancia para los especialistas desplazados.\n\nNo hay compromiso comercial ni vinculación posterior.\n\n________________________________________\n\n¿QUÉ BUSCAMOS?\n\nEste programa está diseñado para hoteles que:\n– Valoren una mirada externa y seria sobre su oferta actual\n– Desean explorar nuevas formas de rentabilidad mediante estancias largas y, en general, estén interesados en repensar su estrategia de ocupación\n– Tengan interés en diferenciarse a través de afinidades temáticas\n\n________________________________________\n\n¿POR QUÉ LO HACEMOS?\n\nPorque creemos en este modelo.\n\nPorque sabemos que muchos hoteles tienen potencial para crecer si cambian el enfoque.\n\nY porque queremos construir una red de hoteles seleccionados que representen lo mejor de Hotel-Living.\n\n________________________________________\n\nCÓMO SOLICITARLO\n\nSi le interesa participar, puede solicitar la visita a través del siguiente formulario.\n\nTodas las solicitudes serán evaluadas cuidadosamente.",
          features: [],
          formTitle: "Solicite su estudio gratuito",
          formDescription: "Complete el formulario y nos pondremos en contacto con usted para programar la visita",
          nameLabel: "Nombre completo",
          emailLabel: "Correo electrónico",
          phoneLabel: "Teléfono",
          hotelLabel: "Nombre del hotel",
          locationLabel: "Ubicación",
          messageLabel: "Mensaje adicional (opcional)",
          submitButton: "SOLICITAR ESTUDIO GRATUITO",
          contactTitle: "INFORMACIÓN DE CONTACTO"
        };
      case 'pt':
        return {
          title: "ESTUDO GRATUITO",
          subtitle: "Obtenha um estudo completo, técnico\ne presencial sobre o seu hotel e as suas possibilidades de desenvolvimento",
          description: "Uma oportunidade única para analisar o seu hotel a partir de uma nova perspetiva\n\nNo âmbito do nosso programa de expansão, e em colaboração com a empresa Bridgepoint Global Consulting, especializada em análise técnica e consultoria hoteleira, oferecemos a possibilidade única de realizar um estudo integral e personalizado do seu estabelecimento, completamente in situ.\n\nESTA CONSULTORIA INCLUI:\n• ✅ Um estudo de mercado contextualizado com dados reais do seu ambiente e concorrentes\n• ✅ Análise SWOT, benchmarking, projeções de rentabilidade e plano de ação inicial\n• ✅ Diagnóstico de forças, fraquezas e elementos diferenciadores\n• ✅ Recomendações para a sua integração no modelo Hotel-Living\n• ✅ Relatório técnico completo, com métricas, estratégias e observações detalhadas\n• ✅ Caso o estabelecimento cumpra com padrões básicos de atratividade, será realizada uma reportagem audiovisual, que será incorporada na secção \"Hotéis Recomendados\" do portal, com visibilidade destacada durante um período de seis meses.\n\nAlém disso, durante a visita, apresentar-lhe-emos uma análise das novas tendências em soluções habitacionais, como o co-living, o housing as a service ou os modelos temáticos de longa estadia. Este contexto permitir-lhe-á avaliar com maior clareza o seu potencial dentro de uma transformação global no setor do alojamento.\n\n________________________________________\n\nDURACIÓN E CUSTO\n\nTrata-se de uma visita presencial de 5 a 7 dias, realizada por dois especialistas da nossa equipa.\n\nNão existe qualquer custo pelo estudo nem pela elaboração do relatório.\n\nApenas se solicitará a cobertura dos gastos básicos de viagem e estadia para os especialistas deslocados.\n\nNão há compromisso comercial nem vinculação posterior.\n\n________________________________________\n\nO QUE PROCURAMOS?\n\nEste programa está concebido para hotéis que:\n– Valorizem um olhar externo e sério sobre a sua oferta atual\n– Desejem explorar novas formas de rentabilidade mediante estadias longas e, em geral, estejam interessados em repensar a sua estratégia de ocupação\n– Tenham interesse em diferenciar-se através de afinidades temáticas\n\n________________________________________\n\nPORQUÊ O FAZEMOS?\n\nPorque acreditamos neste modelo.\n\nPorque sabemos que muitos hotéis têm potencial para crescer se mudarem o enfoque.\n\nE porque queremos construir uma rede de hotéis selecionados que representem o melhor do Hotel-Living.\n\n________________________________________\n\nCOMO SOLICITAR\n\nSe lhe interessa participar, pode solicitar a visita através do seguinte formulário.\n\nTodas as solicitações serão avaliadas cuidadosamente.",
          features: [],
          formTitle: "Solicite o seu estudo gratuito",
          formDescription: "Complete o formulário e entraremos em contacto consigo para agendar a visita",
          nameLabel: "Nome completo",
          emailLabel: "E-mail",
          phoneLabel: "Telefone",
          hotelLabel: "Nome do hotel",
          locationLabel: "Localização",
          messageLabel: "Mensagem adicional (opcional)",
          submitButton: "SOLICITAR ESTUDO GRATUITO",
          contactTitle: "INFORMAÇÕES DE CONTACTO"
        };
      case 'ro':
        return {
          title: "STUDIU GRATUIT",
          subtitle: "Obțineți un studiu complet, tehnic\nși în persoană despre hotelul dvs. și posibilitățile sale de dezvoltare",
          description: "O oportunitate unică de a analiza hotelul dvs. dintr-o perspectivă nouă\n\nÎn cadrul programului nostru de expansiune, în colaborare cu firma Bridgepoint Global Consulting, specializată în analize tehnice și consultanță hotelieră, oferim posibilitatea unică de a realiza un studiu integral și personalizat al etablisamentului dvs., complet in situ.\n\nACEASTĂ CONSULTANȚĂ INCLUDE:\n• ✅ Un studiu de piață contextualizat cu date reale din mediul dvs. și ale concurenților\n• ✅ Analiză SWOT, benchmarking, proiecții de rentabilitate și plan de acțiune inițial\n• ✅ Diagnosticul punctelor tari, slabe și elementelor diferențiatoare\n• ✅ Recomandări pentru integrarea în modelul Hotel-Living\n• ✅ Raport tehnic complet, cu metrici, strategii și observații detaliate\n• ✅ În cazul în care estabelisamentul îndeplinește standardele de bază de atracție, se va realiza un reportaj audiovizual, care va fi încorporat în secțiunea \"Hoteluri Recomandate\" a portalului, cu vizibilitate evidențiată pentru o perioadă de șase luni.\n\nÎn plus, în timpul vizitei, vă vom prezenta o analiză a noilor tendințe în soluțiile de cazare, cum ar fi co-living-ul, housing as a service sau modelele tematice de ședere îndelungată. Acest context vă va permite să evaluați cu mai multă claritate potențialul dvs. în cadrul unei transformări globale în sectorul cazării.\n\n________________________________________\n\nDURATĂ ȘI COST\n\nEste vorba despre o vizită în persoană de 5-7 zile, realizată de doi specialiști din echipa noastră.\n\nNu există niciun cost pentru studiu sau pentru elaborarea raportului.\n\nSe va solicita doar acoperirea cheltuielilor de bază de călătorie și ședere pentru specialiștii deplasați.\n\nNu există angajament comercial sau obligație ulterioară.\n\n________________________________________\n\nCE CĂUTĂM?\n\nAcest program este conceput pentru hoteluri care:\n– Apreciază o perspectivă externă și serioasă asupra ofertei lor actuale\n– Doresc să exploreze noi forme de rentabilitate prin șederi lungi și, în general, sunt interesate să-și regândească strategia de ocupare\n– Au interes să se diferențieze prin afinități tematice\n\n________________________________________\n\nDE CE FACEM ASTA?\n\nPentru că credem în acest model.\n\nPentru că știm că multe hoteluri au potențial de creștere dacă își schimbă abordarea.\n\nȘi pentru că vrem să construim o rețea de hoteluri selectate care să reprezinte ce este mai bun din Hotel-Living.\n\n________________________________________\n\nCUM SĂ SOLICITAȚI\n\nDacă vă interesează să participați, puteți solicita vizita prin următorul formular.\n\nToate solicitările vor fi evaluate cu atenție.",
          features: [],
          formTitle: "Solicitați studiul dvs. gratuit",
          formDescription: "Completați formularul și vă vom contacta pentru a programa vizita",
          nameLabel: "Nume complet",
          emailLabel: "E-mail",
          phoneLabel: "Telefon",
          hotelLabel: "Numele hotelului",
          locationLabel: "Locația",
          messageLabel: "Mesaj suplimentar (opțional)",
          submitButton: "SOLICITAȚI STUDIUL GRATUIT",
          contactTitle: "INFORMAȚII DE CONTACT"
        };
      default: // English
        return {
          title: "FREE STUDY",
          subtitle: "Get a complete technical\nand in-person study about your hotel and its development possibilities",
          description: "A unique opportunity to analyze your hotel from a new perspective\n\nWithin the framework of our expansion program, and in collaboration with Bridgepoint Global Consulting, a firm specialized in technical analysis and hotel consulting, we offer the unique possibility of conducting a comprehensive and personalized study of your establishment, completely on-site.\n\nTHIS CONSULTANCY INCLUDES:\n• ✅ A contextualized market study with real data from your environment and competitors\n• ✅ SWOT analysis, benchmarking, profitability projections and initial action plan\n• ✅ Diagnosis of strengths, weaknesses and differentiating elements\n• ✅ Recommendations for integration into the Hotel-Living model\n• ✅ Complete technical report, with metrics, strategies and detailed observations\n• ✅ If the establishment meets basic attractiveness standards, an audiovisual report will be created, which will be incorporated into the \"Recommended Hotels\" section of the portal, with prominent visibility for a period of six months.\n\nAdditionally, during the visit, we will present an analysis of new trends in housing solutions, such as co-living, housing as a service, or thematic long-stay models. This context will allow you to evaluate with greater clarity your potential within a global transformation in the accommodation sector.\n\n________________________________________\n\nDURATION AND COST\n\nThis is an on-site visit of 5 to 7 days, conducted by two specialists from our team.\n\nThere is no cost for the study or the preparation of the report.\n\nOnly coverage of basic travel and accommodation expenses for the deployed specialists will be requested.\n\nThere is no commercial commitment or subsequent obligation.\n\n________________________________________\n\nWHAT ARE WE LOOKING FOR?\n\nThis program is designed for hotels that:\n– Value an external and serious perspective on their current offering\n– Wish to explore new forms of profitability through long stays and, in general, are interested in rethinking their occupancy strategy\n– Have an interest in differentiating themselves through thematic affinities\n\n________________________________________\n\nWHY DO WE DO THIS?\n\nBecause we believe in this model.\n\nBecause we know that many hotels have potential to grow if they change their approach.\n\nAnd because we want to build a network of selected hotels that represent the best of Hotel-Living.\n\n________________________________________\n\nHOW TO REQUEST\n\nIf you are interested in participating, you can request the visit through the following form.\n\nAll requests will be carefully evaluated.",
          features: [],
          formTitle: "Request your free study",
          formDescription: "Complete the form and we will contact you to schedule the visit",
          nameLabel: "Full name",
          emailLabel: "Email",
          phoneLabel: "Phone",
          hotelLabel: "Hotel name",
          locationLabel: "Location",
          messageLabel: "Additional message (optional)",
          submitButton: "REQUEST FREE STUDY",
          contactTitle: "CONTACT INFORMATION"
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <HotelStarfield />
      <Navbar />
      
      <main className="flex-1 pt-8 relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">
              {content.title}
            </h1>
            <p className="text-xl md:text-2xl text-fuchsia-200 max-w-4xl mx-auto leading-relaxed whitespace-pre-line">
              {content.subtitle}
            </p>
          </div>

          {/* Information Section - Full Width for All Languages */}
          <div className="max-w-7xl mx-auto mb-16">
            <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: '#6C009E', borderColor: '#6C009E' }}>
              <CardContent className="pt-8">
                <div className="text-white text-lg leading-relaxed whitespace-pre-line">
                  {content.description}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Section - Centered for all languages */}
          <div className="max-w-3xl mx-auto">

            {/* Contact Form */}
            <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: '#6C009E', borderColor: '#6C009E' }}>
              <CardHeader>
                <CardTitle className="text-white text-2xl font-bold">
                  {content.formTitle}
                </CardTitle>
                <CardDescription className="text-fuchsia-200">
                  {content.formDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">
                        {content.nameLabel}
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        className="bg-white/10 text-white placeholder:text-white/60"
                        style={{ borderColor: '#6C009E' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        {content.emailLabel}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        className="bg-white/10 text-white placeholder:text-white/60"
                        style={{ borderColor: '#6C009E' }}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">
                        {content.phoneLabel}
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        className="bg-white/10 text-white placeholder:text-white/60"
                        style={{ borderColor: '#6C009E' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hotel" className="text-white">
                        {content.hotelLabel}
                      </Label>
                      <Input
                        id="hotel"
                        type="text"
                        required
                        className="bg-white/10 text-white placeholder:text-white/60"
                        style={{ borderColor: '#6C009E' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">
                      {content.locationLabel}
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      required
                      className="bg-white/10 text-white placeholder:text-white/60"
                      style={{ borderColor: '#6C009E' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white">
                      {content.messageLabel}
                    </Label>
                    <Textarea
                      id="message"
                      rows={4}
                      className="bg-white/10 text-white placeholder:text-white/60"
                      style={{ borderColor: '#6C009E' }}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-white font-bold py-3 text-lg"
                    style={{ backgroundColor: '#1e3a8a', color: 'white' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
                  >
                    {content.submitButton}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="mt-16 text-center">
            <Card className="backdrop-blur-sm border-2 max-w-2xl mx-auto" style={{ backgroundColor: '#6C009E', borderColor: '#6C009E' }}>
              <CardContent className="pt-6">
                <h3 className="text-white text-xl font-bold mb-4">{content.contactTitle}</h3>
                <div className="flex justify-center items-center text-white">
                  <div className="flex items-center">
                    <Mail className="mr-2 text-fuchsia-400" />
                    <span>contact@hotel-living.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}