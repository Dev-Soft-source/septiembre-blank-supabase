
import React from "react";
import { Calendar, Building, CreditCard, Activity, CheckCircle, BookOpen, Clock } from "lucide-react";

interface ActivityIconProps {
  iconName: string;
}

export default function ActivityIcon({ iconName }: ActivityIconProps) {
  switch (iconName) {
    case "Calendar":
      return <Calendar className="w-5 h-5 text-blue-400" />;
    case "Building":
      return <Building className="w-5 h-5 text-fuchsia-400" />;
    case "CreditCard":
      return <CreditCard className="w-5 h-5 text-green-400" />;
    case "Activity":
      return <Activity className="w-5 h-5 text-yellow-400" />;
    case "CheckCircle":
      return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    case "BookOpen":
      return <BookOpen className="w-5 h-5 text-indigo-400" />;
    case "Clock":
      return <Clock className="w-5 h-5 text-orange-400" />;
    default:
      return <Building className="w-5 h-5 text-purple-400" />;
  }
}
