import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "@/hooks/useTranslation";
export function HotelNewAccordionMenuPT() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const { t } = useTranslation('hotel-accordion');
  const handleItemToggle = (value: string) => {
    setOpenItem(openItem === value ? null : value);
  };
  return <div className="pt-4 border-t border-yellow-300/30 bg-[#460F54]/30 rounded-lg p-6 shadow-lg backdrop-blur-sm mb-2 px-0 py-[15px] my-[53px]">
      <Accordion type="single" collapsible className="w-full space-y-3" value={openItem || ""} onValueChange={setOpenItem}>
        
        <AccordionItem value="benefits" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              1 - OS BENEFÍCIOS
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">1.1 - 100% de ocupação o ano todo</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• As taxas de ocupação podem chegar a 100% durante todo o ano</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Zero quartos vazios significa lucro máximo</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Ocupação completa até nos períodos tradicionalmente lentos</p>
                <p className="text-base text-[#FFF9B0] pl-4">• Fluxo constante de receita sem mínimos sazonais</p>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">1.2 - Menores custos operacionais</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Um único dia útil para todas as entradas e saídas. Sem lacunas entre as estadias</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Menor taxa de rotatividade significa menores custos de limpeza</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Estadias prolongadas (8, 16, 24 e 32 dias) reduzem os custos operacionais</p>
                <p className="text-base text-[#FFF9B0] pl-4">• Processos de check-in/check-out simplificados economizam tempo da equipe</p>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">1.3 - Maior estabilidade da equipe</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Ocupação constante = empregos o ano todo</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Menor rotatividade = menores custos com contratação e treinamento</p>
                <p className="text-base text-[#FFF9B0] pl-4">• Maior satisfação dos funcionários com horários estáveis</p>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">1.4 - Receita adicional com atividades temáticas</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Novas fontes de receita com eventos especializados</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Oportunidades de merchandising vinculadas ao tema do hotel</p>
                <p className="text-base text-[#FFF9B0] pl-4">• Ofertas de serviços estendidos aumentam o gasto dos hóspedes</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="compare" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              2 - COMPARE OS SISTEMAS
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-lg font-semibold text-[#FFF9B0] mb-4">MODELO TRADICIONAL</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Entradas/saídas constantes</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Mais limpeza, lavanderia, rotatividade</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Maior carga de trabalho na recepção</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Ocupação imprevisível</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Lacunas entre reservas = noites vazias = lucro perdido</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Altas e baixas temporadas. A equipe vai e vem</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Equipe desmotivada, difícil de treinar, não profissional</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Hóspedes vão e vêm. Sem conexão, sem lealdade</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Reservas frias, isoladas. Uma atrás da outra</p>
                  <p className="text-base text-[#FFF9B0]">• Os apartamentos de aluguel ganham com preços mais baixos</p>
                </div>
                
                <div>
                  <p className="text-lg font-semibold text-[#FFF9B0] mb-4">MODELO HOTEL LIVING</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Dias fixos para entrada/saída = operações mais fluídas</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Menos limpezas, menos transições</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Recepção mais eficiente e otimizada</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Estadias mais longas = maior ocupação</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Zero noites vazias = lucro máximo</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Alta temporada o ano todo. Equipe estável</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Equipe motivada, treinável, profissional</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Os hóspedes se sentem em casa e retornam</p>
                  <p className="text-base text-[#FFF9B0] mb-2">• Não apenas reservas: comunidades</p>
                  <p className="text-base text-[#FFF9B0]">• Elegância. Humanidade. Serviços. Os hotéis ganham</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="dont-just-fill" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              3 - NÃO APENAS LOTAMOS QUARTOS
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <p className="text-base text-[#FFF9B0]">• Hóspedes agrupados por afinidades</p>
              <p className="text-base text-[#FFF9B0]">• Zero acaso. 100% conexões</p>
              <p className="text-base text-[#FFF9B0]">• Hotéis para pertencer, não apenas para se hospedar</p>
              <p className="text-base text-[#FFF9B0]">• Estamos transformando a sociedade</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="profit-lost" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              4 - QUANTO LUCRO ESTÁ SENDO PERDIDO?
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">4.1 HOTÉIS OCIDENTAIS - QUANTO PERDEMOS POR ANO?</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• US$ 90 bilhões por ano segundo estimativas mais conservadoras</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Não é "faturamento", mas lucro puro antes de impostos</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Taxa média real de ocupação: 50%</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Isso cobre custos e gera alguma receita</p>
                <p className="text-base text-[#FFF9B0] pl-4">• Mas significa também perder o lucro puro dos outros 50%</p>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">4.2 QUANTO SEU HOTEL PERDE POR ANO?</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• 5 quartos vazios por dia = US$ 55.000 perdidos por ano</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• 20 quartos vazios por dia = US$ 220.000 de lucro puro perdido</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Um hotel de 200 quartos fechado de outubro a maio = mais de US$ 1 milhão perdido + US$ 420.000 em custos</p>
                <p className="text-base text-[#FFF9B0] pl-4">• Um hotel de 500 quartos? Mais de US$ 3 milhões em lucro perdido</p>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">4.3 A MAIORIA DOS HOTÉIS PERDE SEU VERDADEIRO POTENCIAL</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Quartos vazios são nosso ouro não explorado</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Poucos atingem 100% de ocupação o ano todo</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Não importa o número de estrelas: todos perdemos dinheiro</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Quartos de lucro puro não são vendidos</p>
                <p className="text-base text-[#FFF9B0] pl-4">• Estamos abrindo mão do nosso lugar legítimo na sociedade</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="affinity-hotels" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              5 - O QUE SÃO HOTÉIS POR AFINIDADES?
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">Exemplo 1</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Imagine um hotel focado em tango, teatro ou esportes – ciclismo, golfe, tênis etc.</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• As pessoas interessadas reservam juntas</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Forma-se uma comunidade em torno de interesses comuns</p>
                <p className="text-base text-[#FFF9B0] pl-4">• Sem lacunas entre estadias. Sem perdas</p>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">Exemplo 2</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Hotel temático gastronômico</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Chefs, aulas de culinária, harmonização de vinhos</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Tarifas premium para experiências especializadas</p>
                <p className="text-base text-[#FFF9B0] pl-4">• Ocupação completa com estadias mais longas</p>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">Exemplo 3</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Hotéis de imersão linguística</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Hóspedes com o mesmo nível de idioma agrupados</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• A equipe fala o idioma-alvo</p>
                <p className="text-base text-[#FFF9B0] pl-4">• Experiência linguística completa</p>
              </div>
              
              <p className="text-base italic text-[#FFF9B0] mt-4">Esses hotéis especializados criam comunidades poderosas e mantêm receitas estáveis e previsíveis.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="our-technology" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              6 - NOSSA TECNOLOGIA FAZ O QUE NENHUMA OUTRA PODE
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-4 text-left py-4">
              <p className="text-base text-[#FFF9B0]">• Conecta pessoas com interesses em comum</p>
              <p className="text-base text-[#FFF9B0]">• Coordena entradas e saídas sem lacunas</p>
              <p className="text-base text-[#FFF9B0]">• Otimiza estadias para lucro máximo</p>
              <p className="text-base text-[#FFF9B0]">• Uma plataforma. Múltiplas fontes de receita</p>
              <p className="text-base text-[#FFF9B0]">• Segmentação precisa por interesse e afinidade</p>
              <p className="text-base text-[#FFF9B0]">• Marketing para comunidades motivadas, não viajantes aleatórios</p>
              <p className="text-base text-[#FFF9B0]">• Alcance global com segmentação hiper-específica</p>
              <p className="text-base text-[#FFF9B0]">• Taxas de conversão mais altas. Custos de aquisição mais baixos</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="perfect-networks" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              7 - HOTÉIS POR AFINIDADES = REDES SOCIAIS PERFEITAS
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-4 text-left py-4">
              <p className="text-base text-[#FFF9B0]">• Interesses compartilhados criam conexões instantâneas</p>
              <p className="text-base text-[#FFF9B0]">• A psicologia de grupo prolonga estadias e traz retorno</p>
              <p className="text-base text-[#FFF9B0]">• Atividades temáticas aumentam o compromisso e a lealdade</p>
              <p className="text-base text-[#FFF9B0]">• O sentimento de pertencimento se torna viciante</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="they-need-hotel" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              8 - ELES PRECISAM DO SEU HOTEL
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">PORQUE 40% DA POPULAÇÃO OCIDENTAL:</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Vive sozinha ou em casal</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Está pré-aposentada ou aposentada</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Trabalha online</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• É estudante longe de casa</p>
                <p className="text-base text-[#FFF9B0] pl-4">• Mora longe do trabalho</p>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">E A MAIORIA DELES:</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Quer se livrar das tarefas domésticas</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Se sente muito sozinha</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Não tem vínculos familiares</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Quer ampliar sua vida social</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">• Quer conhecer pessoas com gostos e mentalidades semelhantes</p>
                <p className="text-base text-[#FFF9B0] pl-4">• Precisa da segurança completa de morar em um hotel</p>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">O SONHO DA HUMANIDADE É MORAR EM UM HOTEL</p>
                <p className="text-base text-[#FFF9B0] pl-4 mb-1">Com tudo resolvido</p>
                <p className="text-base text-[#FFF9B0] pl-4">Em férias sem fim</p>
              </div>
              
              <div>
                <p className="text-base text-[#FFF9B0] mb-2">Por que temos 50% dos quartos vazios todo ano?</p>
                <p className="text-base text-[#FFF9B0] mb-2">Porque as pessoas querem socializar. Fazer amigos</p>
                <p className="text-base text-[#FFF9B0] mb-2">Querem ficar mais tempo no seu hotel</p>
                <p className="text-base text-[#FFF9B0] mb-2">Querem que você cuide das tarefas domésticas</p>
                <p className="text-base text-[#FFF9B0] mb-2">Precisam urgentemente dos seus quartos vazios e dos seus serviços</p>
                <p className="text-base text-[#FFF9B0] font-semibold">Ajude: ofereça ambos</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="social-revolution" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              9 - AFINIDADES SÃO A NOVA REVOLUÇÃO SOCIAL
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-4 text-left py-4">
              <p className="text-base text-[#FFF9B0]">• Os hóspedes não querem só quartos: querem sentido</p>
              <p className="text-base text-[#FFF9B0]">• Os interesses conectam mais rápido que os descontos</p>
              <p className="text-base text-[#FFF9B0]">• Estadias temáticas geram lealdade</p>
              <p className="text-base text-[#FFF9B0]">• Desconhecidos viram comunidades</p>
              <p className="text-base text-[#FFF9B0]">• Você não apenas lota quartos: cria pertencimento</p>
              <p className="text-base text-[#FFF9B0]">• Atrai os hóspedes certos, não qualquer um</p>
              <p className="text-base text-[#FFF9B0]">• Sua afinidade é seu ímã</p>
              <p className="text-base text-[#FFF9B0]">• Hotéis com alma são os que conquistam o futuro</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="perfect-integration" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              10 - SOMOS INTEGRAÇÃO PERFEITA
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-4 text-left py-4">
              <p className="text-base text-[#FFF9B0]">• Você não precisa escolher entre sistemas</p>
              <p className="text-base text-[#FFF9B0]">• Combine os modelos como quiser</p>
              <p className="text-base text-[#FFF9B0]">• Comece com poucos quartos e amplie</p>
              <p className="text-base text-[#FFF9B0]">• Passe mais quartos para o nosso sistema quando fizer sentido</p>
              <p className="text-base text-[#FFF9B0]">• Nossa plataforma se integra perfeitamente</p>
              <p className="text-base text-[#FFF9B0]">• Zero interrupções no seu dia a dia</p>
              <p className="text-base text-[#FFF9B0]">• Nós nos adaptamos a você, não o contrário</p>
              <p className="text-base text-[#FFF9B0] font-semibold mt-4">Isso é flexibilidade. Isso é rentabilidade.</p>
              <p className="text-base text-[#FFF9B0] font-semibold">Isso é integração perfeita</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="steps-join" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              11 - PASSOS PARA ENTRAR NO HOTEL-LIVING
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">IDENTIFIQUE SEUS QUARTOS DISPONÍVEIS</p>
                <p className="text-base text-[#FFF9B0] pl-4">Avalie quantos quartos do seu hotel ficam vazios por pelo menos 8 dias consecutivos em certas épocas do ano.</p>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">DEFINA UM CONCEITO BASEADO EM AFINIDADES</p>
                <p className="text-base text-[#FFF9B0] pl-4">Pense em uma "afinidade" que possa atrair seu tipo ideal de hóspede, baseado na localização, clientela usual ou suas preferências.</p>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">REGISTRE-SE E USE O CALCULADOR ONLINE</p>
                <p className="text-base text-[#FFF9B0] pl-4">Acesse nossa calculadora Hotel Living para testar modelos de estadia e simular preços e receitas.</p>
              </div>
              
              <div>
                <p className="text-lg font-semibold text-[#FFF9B0] mb-2">ADICIONE SEU HOTEL AO PAINEL</p>
                <p className="text-base text-[#FFF9B0] pl-4">Complete os passos para "Adicionar nova propriedade" e gerencie disponibilidade e reservas de longa estadia.</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="calculadora" className="overflow-hidden border-none shadow-xl">
          <AccordionTrigger className="px-6 py-4 text-left hover:no-underline bg-gradient-to-r from-[#730483] to-[#570366] rounded-t-xl border-l-6 border-[#FFF9B0] hover:from-[#8A0499] hover:to-[#660377] transition-all duration-300">
            <div className="text-[#FFF9B0] font-bold text-base md:text-lg">
              12 - {t('calculator.title')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 py-4 bg-[#560365]/90 backdrop-blur-md rounded-b-xl border-l-6 border-[#FFF9B0]/50">
            <div className="space-y-6 text-left py-6">
              <div className="space-y-4 text-[#FFF9B0] text-base whitespace-pre-line">
                {t('calculator.text')}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-3">
                  <h4 className="text-[#FFF9B0] font-bold text-lg">Versão em Inglês</h4>
                  <img 
                    src="/lovable-uploads/a434a2cc-c665-4c9b-828a-d5945a335947.png" 
                    alt="Calculadora Hotel-Living Versão Inglês" 
                    className="w-full h-auto rounded-lg border border-[#FFF9B0]/30 shadow-lg"
                  />
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-[#FFF9B0] font-bold text-lg">Versão em Espanhol</h4>
                  <img 
                    src="/lovable-uploads/132f46c4-4760-4907-bb8a-30ea52da9991.png" 
                    alt="Calculadora Hotel-Living Versão Espanhol" 
                    className="w-full h-auto rounded-lg border border-[#FFF9B0]/30 shadow-lg"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>;
}