
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";

export const ReferralPreview: React.FC = () => {
  const { profile } = useAuth();
  
  // Format the user's full name
  const userFullName = 
    profile && (profile.first_name || profile.last_name) 
      ? `${profile.first_name || ''} ${profile.last_name ? profile.last_name.charAt(0) + '.' : ''}`.trim()
      : "You";

  return (
    <Card className="mb-6 p-5 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="text-sm">
        <p className="font-semibold mb-3">🎉 This is the message that will be sent to the hotel:</p>
        
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p className="font-medium">🎉 Congratulations!</p>
          <p>One of your excellent clients, <span className="font-medium">{userFullName}</span>, has recently recommended your hotel to be featured on Hotel-Living.</p>
          <p>Their appreciation for your service inspired us to reach out and personally invite you to join our platform.</p>
          
          <p>We'd love for you to discover what Hotel-Living offers — a curated space for long-term thematic stays, ideal for outstanding hotels like yours.</p>
          
          <p>👉 Learn more and register your hotel here:<br />
          <a href="/hotels" className="text-fuchsia-600 hover:underline">Hotel-Living – Discover Hotels</a></p>
          
          <p>Congratulations again on earning your client's enthusiastic recommendation!</p>
        </div>
      </div>
    </Card>
  );
};
