import React from "react";
import { Routes, Route } from "react-router-dom";
import IntegrityTestsPage from "./IntegrityTestsPage";
// Import other admin panel components...

const PanelFernandoContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/integrity-tests" element={<IntegrityTestsPage />} />
      {/* Other admin routes... */}
    </Routes>
  );
};

export default PanelFernandoContent;
