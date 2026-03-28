import React from "react";
import { AssociationRegistration } from "@/components/association/AssociationRegistration";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Starfield } from "@/components/Starfield";

const AssociationRegistrationPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Starfield />
      <Navbar />
      
      <main className="flex-1 pt-20 pb-8 px-4">
        <div className="container mx-auto flex justify-center items-center min-h-[calc(100vh-140px)]">
          <div className="w-full max-w-md">
            <AssociationRegistration />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AssociationRegistrationPage;