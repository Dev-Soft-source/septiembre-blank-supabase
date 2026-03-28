import React from "react";
import { FilterState } from "../FilterTypes";
import { useTranslation } from "@/hooks/useTranslation";

interface ActivityFilterListProps {
  type: keyof FilterState;
  fontSize: string;
}

export const ActivityFilterList: React.FC<ActivityFilterListProps> = ({ type, fontSize }) => {
  const { language } = useTranslation();
  
  // Activities from backup data - exact list provided by user
  const activities = [
    "Baile Bachata", "Baile Clásico", "Baile de Salón", "Baile Rock & Roll", "Baile Salsa", 
    "Baile Tango", "Ballet & Danza", "Bicicleta", "Bienestar Emocional", "Cata de Vinos", 
    "Charlas Motivación", "Cine al Aire Libre", "Cine Clásico", "Cine & Debate", "Conciertos Jazz", 
    "Conversa Alemán", "Conversa Español", "Conversa Francés", "Conversa Inglés", "Conversa Ruso", 
    "Crecimiento Personal", "Degustación Gourmet", "Espectáculo Comedia", "Espectáculo Flamenco", 
    "Espectáculo Ópera", "Espectáculo Stand-Up", "Espectáculo Teatro en Vivo", "Espiritualidad", 
    "Excursión Cultural", "Excursión Noche", "Feria Local & Mercadillos", "Fiestas Temáticas", 
    "Fitness", "Juegos de Cartas", "Juegos de Mesa", "Karaoke", "Kayak", "Meditación", "Mindfulness", 
    "Museos & Galerías", "Música en Vivo", "Observación Estrellas", "Paddle Surf", "Picnic Social", 
    "Pilates", "Playa & Voley", "Repostería Dulce", "Retiro Espiritual", "Senderismo", "Spa & Masaje", 
    "Taller Artesanía Local", "Taller Cerámica", "Taller Cocina Asiática", "Taller Cocina Española", 
    "Taller Cocina Italiana", "Taller Cocina Local", "Taller Coctelería", "Taller Danza Regional", 
    "Taller Fotografía", "Taller Jardinería Urbana", "Taller Manualidades", "Taller Música Instrumental", 
    "Taller Pintura", "Torneo Ajedrez", "Trivia Quiz", "Visitas Guiadas Históricas", "Yoga Relax"
  ];

  const getLocalizedActivity = (activity: string): string => {
    // For now, return the activity as is since they're provided in Spanish
    // In the future, this could be extended to use translation files
    return activity;
  };

  return (
    <div className="max-h-60 overflow-y-auto">
      {activities.map((activity) => (
        <button
          key={activity}
          onClick={() => {
            console.log("ActivityFilterList - Activity filter selected:", activity);
            console.log("ActivityFilterList - Event type:", type);
            document.dispatchEvent(new CustomEvent('updateFilter', { 
              detail: { key: type, value: activity } 
            }));
          }}
          className={`w-full text-left px-3 py-2 rounded-md ${fontSize} font-bold transition-colors hover:bg-[#460F54]`}
        >
          {getLocalizedActivity(activity)}
        </button>
      ))}
    </div>
  );
};