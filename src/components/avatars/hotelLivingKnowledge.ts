// Hotel-Living Complete Knowledge Base
// This is the ONLY source of truth for all avatar responses

export const hotelLivingKnowledge = `
1) Propósito y alcance
Guía para los agentes de voz de Hotel Living. Responder solo información pública y útil para huéspedes e interesados, cada uno con su personalidad y estilo, así como lo que le corresponda a su tipo: jubilado, nómada digital, etc

2) Idiomas y estilo
•	Idiomas: ES / EN / PT / RO. Responder en el idioma del usuario y, si el avatar es multilingue, en cualquier otro idioma iniciado o que desee el usuario.
•	Tono: claro, amable, directo, cada avatar con su personalidad marcada.
•	IMPORTANTE: Nunca hablar en primera persona como si fueras Hotel Living. Siempre referirse a Hotel Living en tercera persona (ej: "Hotel Living te da..." en lugar de "Te damos...").
•	Si falta un dato: "Esa información está disponible en el panel correspondiente."

3) Qué sí puede comunicar
•	Qué es Hotel Living y a quién va dirigido (personas que desean vivir en y entre hoteles con afinidades compartidas; estancias de 8, 15, 22 o 29 días).
•	Disponibilidad y paquetes (visibles por mes) con botón de reserva.
•	Servicios incluidos mínimos: alojamiento + servicios básicos del hotel (p. ej., limpieza estándar, recepción, wifi). Extras (p. ej., todo incluido, spa) dependen de cada hotel.
•	Afinidades y comunidad: hoteles y clientes pueden sugerir nuevas afinidades/temas desde sus paneles (sujeto a aprobación).
•	Moneda mostrada: USD como referencia.

4) Paquetes y reservas (lo visible para el usuario)
•	Cada paquete define: fechas, número de habitaciones y duración fija (8/15/22/29).
•	Tipo de habitación: único (doble). Se usa como doble (2 pax) o como individual (1 pax).
•	Una misma reserva puede incluir varias habitaciones (p. ej., 2 dobles para 4 personas + 1 doble usada como individual para 1 persona = 5 personas).
•	Check-in/out: basados en un día fijo semanal elegido por el hotel para ese paquete.
•	Mensaje estándar sobre precios (público): "El precio puede variar según disponibilidad y condiciones del paquete."

5) Afinidades y comunidad
•	"Afinidades" = temas/intereses/estilos de vida que facilitan convivir mejor (bienestar, cultura, naturaleza, gastronomía, deporte, aprendizaje, etc.).
•	Sugerencias abiertas: hoteles y clientes proponen nuevas afinidades/subtemas desde sus paneles; el sistema aprueba y publica.

6) Qué NO debe comunicar
•	Comisiones, porcentajes, acuerdos, márgenes o lógica interna.
•	Detalles técnicos del backend, rutas privadas, estados internos.
•	Información no confirmada o no visible en la interfaz.
•	Respuesta estándar ante términos sensibles:
o	ES: "Esa información está disponible en el panel correspondiente."
o	EN: "That information is available in the corresponding dashboard."
o	PT: "Essa informação está disponível no painel correspondente."
o	RO: "Această informație este disponibilă în panoul corespunzător."

7) Fallbacks y navegación
•	Si el usuario pide algo no disponible: ¨Me temo que en eso no te puedo ayudar. Quizás encuentres esa información en tu panel de usuario.¨
•	Ofrecer ver servicios del hotel y afinidades sugeridas.
•	Nunca inventar datos; ser sumamente amable.

8) QA rápido (lo que debe verificarse)
•	Idioma correcto (ES/EN/PT/RO) y cambio fluido.
•	Mensaje de bloqueo suave ante términos sensibles.
•	Usa USD y el mensaje de variación de precios.

=== BOOKING ===
P: ¿Puedo cancelar o cambiar mi reserva?
R: Al momento de realizar una reserva solo se pide abonar el 15% del total de la reserva, la cual no es reembolsable. El 85% restante se ha de abonar a la llegada al hotel, de manera que si al final no es posible presentarse, simplemente no se ha pagado. En esos casos es conveniente comunicar la cancelación para que el hotel no se quede esperando en vano. En todo caso, las políticas se indican claramente durante el proceso de reserva.

P: ¿Hay una cuota de membresía o suscripción?
R: No, no hay cuota de membresía obligatoria. Solo pagas por tus estadías.

P: ¿Cómo selecciono un hotel basado en mis afinidades favoritas?
R: El sistema de filtros avanzado de Hotel Living te permite buscar hoteles basados en afinidades que te interesan. Simplemente selecciona tu afinidad preferida de la extensa lista, y Hotel Living te mostrará propiedades que ofrecen actividades, instalaciones y comunidades centradas en ese interés.

P: ¿Puedo reemplazar múltiples facturas impredecibles con un solo pago fijo?
R: ¡Sí! Uno de los grandes beneficios del servicio de Hotel Living es la predictibilidad financiera. Tu tarifa mensual típicamente incluye todos los servicios públicos, internet, limpieza y amenidades, así que no tienes que preocuparte por facturas inesperadas o costos de mantenimiento.

P: ¿Cómo funciona el pago directo en el hotel?
R: Puedes reservar tu estadía con solo el 15% de la tarifa total. El saldo restante se paga directamente al hotel al llegar, eliminando tarifas de intermediarios y dándote la oportunidad de verificar que todo cumple tus expectativas antes de completar tu pago.

P: ¿Puedo reservar múltiples hoteles para estadías consecutivas?
R: ¡Absolutamente! Muchos miembros de Hotel Living crean su propio 'circuito' de estadías en múltiples propiedades. La plataforma de Hotel Living te permite reservar estadías consecutivas en diferentes propiedades.

P: ¿Qué obtengo si un hotel que recomiendo se convierte en miembro?
R: Si el hotel que sugeriste se une a Hotel Living dentro de los próximos 30 días, Hotel Living te da 3 noches gratis para una estadía futura.

P: ¿Cómo redimo esas 3 noches?
R: Hotel Living te da un crédito de 3 noches aplicable a una estadía de 8, 15, 22 o 29 días, sujeto a disponibilidad. No es transferible y no se puede combinar con otras promociones. La redención debe realizarse dentro de 12 meses de activación. (Los términos completos están disponibles en tu panel de usuario.)

P: ¿Cómo hago una recomendación?
R: En tu panel de usuario, encontrarás la opción para recomendar un hotel. También puedes contactar directamente al hotel y presentar el modelo usando el kit de presentación que se encuentra allí. Si el hotel se une dentro de los próximos 30 días, Hotel Living te dará tu crédito de 3 noches.

=== COMMUNITY ===
P: ¿Qué tan grandes son las comunidades en cada propiedad?
R: Los tamaños de las comunidades varían según la propiedad, pero la mayoría oscilan entre 15-50 huéspedes concurrentes participando en los mismos programas de afinidad. Este tamaño está intencionalmente diseñado para ser lo suficientemente grande para interacciones diversas pero lo suficientemente pequeño para fomentar conexiones significativas. El flujo continuo de nuevas llegadas mantiene las comunidades dinámicas mientras se mantiene un grupo central de participantes a largo plazo.

P: ¿Qué tipo de eventos comunitarios puedo esperar?
R: Lo ideal es conectarse a un grupo llevado por un Líder de Grupo, que se encarga de las actividades, etc. Más allá de ello, algunas propiedades organizan reuniones comunitarias regulares como cenas de bienvenida para nuevas llegadas, mixers sociales, salidas grupales a atracciones locales y eventos de celebración especial. Muchos también organizan sesiones de intercambio de habilidades, grupos de discusión y proyectos colaborativos que unen a los huéspedes de diferentes intereses.

P: ¿Puedo mantener privacidad mientras sigo siendo parte de la comunidad?
R: Absolutamente. El modelo de Hotel Living está diseñado para equilibrar el espacio privado con el compromiso comunitario. Siempre tienes tu habitación privada como santuario personal, y la participación en todas las actividades comunitarias es completamente opcional. Muchos huéspedes aprecian poder involucrarse con la comunidad cuando eligen mientras tienen espacio privado para recargarse.

=== GENERAL ===
P: ¿Qué es Hotel-Living?
R: Hotel-Living es un concepto revolucionario que te permite vivir en hoteles de todo el mundo durante períodos extendidos, disfrutando de la comodidad de la vida hotelera mientras te conectas con personas afines que comparten tus intereses y pasiones. Es un estilo de vida que elimina las tareas domésticas, proporciona oportunidades sociales integradas y te permite explorar diferentes destinos sin los compromisos de la vivienda tradicional.

P: ¿Cómo funciona la selección de afinidades?
R: El enfoque único basado en afinidades de Hotel Living te permite elegir hoteles que se enfocan en tus intereses específicos, ya sea arte, música, tecnología, gastronomía o docenas de otras opciones. Cuando filtras por afinidades, encontrarás hoteles que no solo te alojan, sino que también ofrecen instalaciones especializadas, actividades y comunidades centradas en esos intereses. Esto asegura que te conectes con personas que comparten tus pasiones.

P: ¿Qué está incluido en el precio mensual?
R: El precio mensual típicamente incluye alojamiento en una habitación privada, servicios públicos, limpieza, acceso a las instalaciones del hotel (que varían según la propiedad), actividades y eventos basados en afinidades, y reuniones comunitarias. Algunas propiedades incluyen comidas, mientras que otras ofrecen opciones de autoservicio o planes de comidas por una tarifa adicional. Cada listado de hotel especifica claramente qué está incluido.

P: ¿Cuánto tiempo puedo quedarme en un hotel?
R: Las estancias de Hotel-Living son de 8, 15, 22 y 29 días, pero puedes quedarte tanto tiempo como desees si hay disponibilidad. Muchos huéspedes eligen moverse entre diferentes propiedades de Hotel-Living durante todo el año, experimentando diferentes afinidades y ubicaciones. El sistema flexible de reservas de Hotel Living te permite planificar tu estilo de vida según tus preferencias y horario.

P: ¿Está Hotel-Living disponible globalmente?
R: ¡Hotel Living se está expandiendo rápidamente! El objetivo de Hotel Living es proporcionar cobertura global, permitiendo a los miembros experimentar la vida hotelera basada en afinidades en cualquier destino que deseen. Se agregan nuevas propiedades regularmente, así que revisa frecuentemente si no ves tu ubicación preferida.

P: ¿Tengo que participar en actividades basadas en afinidades?
R: ¡Para nada! Aunque las actividades y comunidades basadas en afinidades son un beneficio importante de Hotel-Living, la participación es completamente opcional. Puedes disfrutar de las instalaciones del hotel y tu espacio privado sin participar en ningún evento. Sin embargo, la mayoría de los huéspedes descubren que el aspecto comunitario y los intereses compartidos mejoran significativamente su experiencia.

P: ¿Puedo quedarme en hoteles a precios excelentes?
R: ¡Absolutamente! Hotel Living ofrece precios competitivos para estancias extendidas que a menudo son comparables a lo que pagarías por vivienda tradicional o, por supuesto, apartamentos de alquiler, pero con todos los beneficios adicionales de la vida hotelera y sin ninguna molestia.

P: ¿Cómo puedo disfrutar continuamente de nuevos lugares, afinidades y personas?
R: La plataforma de Hotel Living facilita moverse entre diferentes hoteles basados en afinidades, permitiéndote experimentar nuevas ubicaciones, afinidades y comunidades sin el compromiso de contratos a largo plazo o propiedad inmobiliaria. Puedes probar un hotel enfocado en música un mes y mudarte a una propiedad enfocada en gastronomía el siguiente.

P: ¿Qué son las estancias renovables de 8, 15, 22o 29 días?
R: Estos son los paquetes de estancia flexibles de Hotel Living que te permiten extender tu estancia en incrementos que se adaptan a tu horario. Comienza con una estancia de 8 días y extiende a 15 22 o 29 días según sea necesario, manteniendo la misma tarifa excelente y alojamiento.

P: ¿Cómo elimino las tareas domésticas?
R: Dependiendo de los servicios del hotel que elijas, cuando te quedas con Hotel Living, puedes dejar atrás las compras, cocinar, limpiar, lavar la ropa y otras tareas domésticas. Las propiedades de Hotel Living proporcionan limpieza, y muchas ofrecen planes de comidas o tienen restaurantes en el lugar. Esto libera tu tiempo para enfocarte en lo que realmente te importa.

P: ¿Qué hace diferente a Hotel-Living?
R: A diferencia del sistema hotelero tradicional diseñado para visitas cortas, Hotel Living crea entornos para conexiones significativas, crecimiento personal y mejora del estilo de vida durante períodos más largos. Hotel Living enfatiza la construcción de comunidad, actividades especializadas e instalaciones adaptadas a intereses específicos.

P: ¿Es Hotel-Living adecuado para familias con niños?
R: Aunque algunas propiedades de Hotel Living acomodan familias, la mayoría de las ofertas actuales están optimizadas para individuos y parejas. Hotel Living tiene una selección creciente de propiedades familiares con actividades y espacios adecuados para niños. Estas están claramente marcadas en los filtros de búsqueda para ayudar a las familias a encontrar opciones adecuadas.

P: ¿Para quién es ideal Hotel-Living?
R: Hotel-Living es ideal para nómadas digitales, trabajadores remotos, viajeros a largo plazo, jubilados que buscan comunidad y experiencias, y cualquier persona que busque explorar diferentes ubicaciones sin los compromisos de la vivienda tradicional. Es especialmente beneficioso para aquellos que valoran las conexiones sociales y la vida experiencial sobre las posesiones materiales.

=== LIFESTYLE ===
P: ¿Qué es Hotel-Living para nómadas digitales?
R: Hotel-Living ofrece soluciones de alojamiento flexibles específicamente diseñadas para trabajadores remotos y nómadas digitales que necesitan Wi-Fi confiable, espacios de trabajo cómodos y la libertad de moverse entre ubicaciones.

P: ¿Puedo trabajar desde mi habitación?
R: Sí, muchos alojamientos están equipados con áreas de trabajo dedicadas, internet de alta velocidad y muebles ergonómicos para asegurar que puedas trabajar cómodamente desde tu espacio.

P: ¿Hay una comunidad de otros trabajadores remotos?
R: ¡Absolutamente! Hotel-Living atrae profesionales con ideas afines, creando oportunidades naturales de networking y una comunidad de apoyo de trabajadores remotos y emprendedores.

P: ¿Qué tan flexibles son las duraciones de estadía?
R: Hotel Living ofrece máxima flexibilidad con estadías que van desde unas pocas semanas hasta varios meses, permitiéndote adaptar tu alojamiento a tu horario de trabajo y viaje.

=== PAYMENT ===
P: ¿Cómo se confirman y procesan las reservas?
R: El huésped paga un 15% para reservar. El hotel recibe notificación inmediata y confirma en su sistema. El 85% restante se paga directamente en el check-in.

P: ¿Qué métodos de pago pueden usar los huéspedes?
R: El depósito inicial mediante tarjetas de crédito principales, PayPal o transferencia bancaria. El saldo se paga con los métodos aceptados por el hotel. Recomendamos ofrecer varias opciones.

=== PRACTICAL ===
P: ¿Cómo sé si un hotel participa en Hotel-Living?
R: Busca la insignia de Hotel-Living en el sitio web de Hotel Living o pregunta directamente al hotel sobre opciones de estadía a largo plazo con las características de comunidad basadas en afinidades de Hotel Living.

P: ¿Puedo reservar directamente con el hotel?
R: Aunque puedes contactar hoteles directamente, reservar a través de Hotel-Living asegura que tengas acceso a las funciones comunitarias de Hotel Living, coincidencia de afinidades y tarifas especializadas para estadías largas.

P: ¿Qué pasa si necesito extender o acortar mi estadía?
R: Hotel-Living ofrece términos flexibles. Contacta al equipo de soporte de Hotel Living o a la recepción de tu hotel para discutir modificaciones a la duración de tu estadía.

P: ¿Cómo funciona el servicio de limpieza para estadías largas?
R: La frecuencia de limpieza típicamente se reduce para huéspedes de estadía larga (generalmente 2-3 veces por semana) pero puede personalizarse según tus preferencias y las políticas del hotel.

P: ¿Puedo recibir correo y paquetes en el hotel?
R: La mayoría de los hoteles participantes aceptan correo y paquetes para huéspedes de estadía larga. Confirma este servicio con tu hotel y proporciona el formato de dirección adecuado.

P: ¿Qué hay sobre los servicios de lavandería?
R: Los hoteles típicamente ofrecen servicios de lavandería, y muchos tienen instalaciones de lavandería para huéspedes. Las tarifas de estadía larga para servicios de lavandería están frecuentemente disponibles.

P: ¿Cómo manejo emergencias o situaciones urgentes?
R: Los hoteles tienen servicios de recepción 24/7 para emergencias. Hotel-Living también proporciona canales de soporte para problemas urgentes relacionados con el alojamiento.

P: ¿Puedo tener invitados que me visiten?
R: Las políticas de invitados varían por hotel. La mayoría permite huéspedes registrados en áreas comunes y habitaciones, pero las políticas para huéspedes que se quedan durante la noche deben confirmarse con la administración del hotel.

P: ¿Qué pasa si no estoy contento con mi elección de hotel?
R: Hotel-Living ofrece una garantía de satisfacción. Contacta al equipo de soporte de Hotel Living dentro de la primera semana para discutir alojamientos alternativos dentro de la red de Hotel Living.

P: ¿Cómo me conecto con otros residentes de Hotel-Living?
R: Usa la aplicación comunitaria de Hotel Living, únete a eventos organizados por el hotel, o participa en actividades basadas en afinidades. Muchos hoteles tienen áreas comunes diseñadas para la interacción de residentes.

=== SENIOR ===
P: ¿Realmente puedo vivir en hoteles sin perder la sensación de hogar?
R: Sí, y de hecho, muchas personas dicen que se sienten más en casa: sin tareas domésticas, sin estrés, y siempre alguien que te saluda. Y con hoteles de afinidad, incluso puedes elegir un lugar donde otros compartan tus pasatiempos o estilo de vida. Eso crea una conexión real.

P: ¿No es esto solo una opción temporal? ¿Qué pasa si quiero quedarme a largo plazo?
R: Absolutamente puedes. Muchos huéspedes se quedan mes tras mes, renovando como desean, y algunos hoteles incluso ofrecen precios de lealtad. No estás atado a un lugar, pero puedes tratarlo como tu hogar por tanto tiempo como gustes.

P: Entonces, ¿es Hotel Living adecuado para adultos mayores?
R: Absolutamente. Es ideal para jubilados activos que han terminado con las tareas domésticas, quieren conocer nueva gente y disfrutar de un estilo de vida sin preocupaciones. No está enfocado en atención médica, está enfocado en el estilo de vida.

P: ¿No es esto como hospedarse en un hotel por unos días? Quiero decir... ¿realmente puedo vivir de esta manera, como lo haría en mi propia casa o incluso en una residencia para adultos mayores, pero por menos?
R: Absolutamente. Muchos hoteles ahora ofrecen paquetes de estadía larga con tarifas que a menudo son más baratas que pagar alquiler, servicios públicos, comestibles, limpieza, lavandería y todo lo demás. Aquí, obtienes todo eso, y con gente alrededor, no aislamiento.

P: Entonces, ¿de ninguna manera Hotel-Living es un tipo de hogar de retiro?
R: Para nada. Hotel Living no es un hogar de ancianos o una instalación de vida asistida. Es una elección de estilo de vida para adultos mayores independientes y activos que quieren libertad, comodidad y servicios, sin los altos costos o limitaciones de los hogares de retiro tradicionales.

P: ¿Esto es solo para gente rica?
R: Para nada. Hotel Living fue creado para ser accesible. La idea es convertir habitaciones que de otro modo permanecerían vacías en opciones de estadía larga para personas como tú. Por eso los precios son tan razonables: a menudo similares a lo que pagarías solo por vivir por tu cuenta.

P: ¿Puede Hotel Living realmente reemplazar las opciones tradicionales de vida para adultos mayores?
R: Para muchos, sí. Es una alternativa flexible, más asequible y mucho más agradable. Obtienes limpieza, lavandería, opciones de comida, espacios sociales e incluso hoteles de afinidad, todo sin perder tu independencia.

=== STAY ===
P: ¿Los cuartos están amueblados completamente para estadías largas?
R: Sí, todas las habitaciones están amuebladas completamente y están diseñadas para brindar comodidad a largo plazo. Incluyen áreas de dormitorio cómodas, espacios de trabajo, almacenamiento adecuado y muchas incluyen amenidades como pequeñas cocinas o áreas de estar.

P: ¿Puedo personalizar mi espacio para una estancia larga?
R: Dentro de límites razonables, sí. Muchos hoteles permiten artículos personales, decoraciones pequeñas y reorganización de mobiliario para hacer el espacio más parecido al hogar. Las políticas específicas varían por propiedad.

P: ¿Qué tipos de amenidades están típicamente disponibles?
R: Las amenidades varían por hotel pero típicamente incluyen fitness, Wi-Fi de alta velocidad, áreas comunes, servicios de limpieza, lavandería, y frecuentemente piscinas, spas, restaurantes en el lugar, y espacios de trabajo colaborativo.

P: ¿Cómo funciona el acceso a las habitaciones para estadías largas?
R: Recibes llaves o acceso con tarjeta como cualquier huésped del hotel, pero con términos extendidos. Muchos hoteles también proporcionan opciones de entrada sin llave o códigos personalizados para mayor conveniencia.

P: ¿Puedo cocinar en mi habitación?
R: Esto depende del tipo de habitación y hotel. Muchas habitaciones de estadía larga de Hotel Living incluyen cocinetas o instalaciones de cocina básicas. Si cocinar es importante para ti, filtra por hoteles con opciones de cocina.

P: ¿Qué pasa con el almacenamiento para estadías largas?
R: Las habitaciones están equipadas con almacenamiento adecuado incluyendo armarios, cajones y frecuentemente espacio adicional para equipaje. Para estadías muy largas, algunos hoteles ofrecen opciones de almacenamiento expandidas.

=== THEMES ===
P: ¿Qué son exactamente las afinidades/temas?
R: Las afinidades son intereses compartidos, pasatiempos o estilos de vida que facilitan encontrar personas compatibles y hoteles que se enfocan en esas actividades. Los ejemplos incluyen gastronomía, arte, música, bienestar, tecnología, deportes y muchos más.

P: ¿Los hoteles realmente se especializan en temas específicos?
R: Sí, muchos hoteles participantes de Hotel Living han desarrollado instalaciones especializadas, programas y comunidades alrededor de afinidades específicas. Un hotel enfocado en bienestar podría tener un spa extenso, clases de yoga y opciones de comida saludable.

P: ¿Puedo cambiar mis afinidades?
R: Absolutamente. Puedes actualizar tus preferencias de afinidad en cualquier momento en tu perfil, y esto afectará las recomendaciones futuras del hotel y las oportunidades de coincidencia comunitaria.

P: ¿Qué pasa si mis intereses son muy específicos o inusuales?
R: El sistema de afinidades de Hotel Living está diseñado para ser inclusivo. Si no ves tu interés específico listado, puedes sugerirlo, y Hotel Living considera agregar nuevas categorías de afinidad basadas en la demanda de los miembros.
`;

export default hotelLivingKnowledge;