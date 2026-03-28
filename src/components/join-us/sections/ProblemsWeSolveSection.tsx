
import React from "react";
import { Lightbulb } from "lucide-react";
import { TextSection } from "@/components/join-us/TextSection";

// Problems we solve section data
const problemsWeSolveData = {
  paragraphs: [
    "🏨 On one side:",
    "🏢 HOTEL OCCUPANCY IN THE WEST IS JUST 50.3%",
    "• That means 4.7 billion hotel nights every year not only go unused — they generate losses.",
    "• Every year, 72,000 Western hotels are forced to shut down for up to 7 months due to lack of demand.",
    "________________________________________",
    "👤 ON THE OTHER SIDE — IN THOSE SAME COUNTRIES:",
    "370 MILLION PEOPLE:",
    "• Living alone or as couples",
    "• Pre-retired, retired, digital workers, or remote professionals",
    "• Tired of cooking, cleaning, daily repetition, loneliness, and lack of meaningful social life",
    "________________________________________",
    "These are 370 million individuals with stable income and freedom of movement.",
    "",
    "• Their \"impossible dream\"?",
    "To live with everything taken care of, enjoying a full array of services, attention, vibrant social interaction, and constant activities. And for many of them, pre-retired, retired, ecc, to live as if on permanent vacation",
    "",
    "• And if they're going to dream...",
    "They'd dream of being surrounded by people who share their values, interests, and lifestyle.",
    "",
    "Because the ultimate life is to live among people who truly match who you are.",
    "",
    "WE ARE THE SOLUTION FOR THOSE 4,7 B EMPTY HOTEL NIGHTS, AND FOR A LUCKY FRACTION, 3,1% IN FACT, OF THOSE 370 MILLIONS OF PEOPLE NEEDING OUR SERVICES"
  ]
};

export function ProblemsWeSolveSection() {
  return (
    <TextSection icon={Lightbulb} title="THE PROBLEMS WE SOLVE" paragraphs={problemsWeSolveData.paragraphs} />
  );
}
