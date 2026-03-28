
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthGuard } from "@/components/auth/AdminAuthGuard";
import PanelFernandoLayout from "@/components/panel-fernando/PanelFernandoLayout";
import FernandoHotels from "@/components/panel-fernando/FernandoHotels";
import FernandoBookings from "@/components/panel-fernando/FernandoBookings";
import FernandoPayments from "@/components/panel-fernando/FernandoPayments";
import FernandoStatistics from "@/components/panel-fernando/FernandoStatistics";
import FernandoCommunications from "@/components/panel-fernando/FernandoCommunications";
import FernandoAdvertising from "@/components/panel-fernando/FernandoAdvertising";
import FernandoAffinities from "@/components/panel-fernando/FernandoAffinities";
import FernandoFilters from "@/components/panel-fernando/FernandoFilters";
import FernandoUserRoles from "@/components/panel-fernando/FernandoUserRoles";
import FernandoAnalytics from "@/components/panel-fernando/FernandoAnalytics";
import FernandoTranslations from "@/components/panel-fernando/FernandoTranslations";
import FernandoBatches from "@/components/panel-fernando/FernandoBatches";
import Fernando32DayHotels from "@/components/panel-fernando/Fernando32DayHotels";
import FernandoNotificationLogs from "@/components/panel-fernando/FernandoNotificationLogs";
import FernandoPDFSubmissions from "@/components/panel-fernando/FernandoPDFSubmissions";
import FernandoPriceCorrector from "@/components/panel-fernando/FernandoPriceCorrector";
import { FernandoPackageCreator } from "@/components/panel-fernando/FernandoPackageCreator";
import StabilityTests from "@/pages/admin/StabilityTests";


export default function PanelFernando() {
  return (
    <AdminAuthGuard>
      <PanelFernandoLayout>
        <Routes>
          <Route path="/" element={<FernandoHotels />} />
          <Route path="/hotels" element={<FernandoHotels />} />
          <Route path="/bookings" element={<FernandoBookings />} />
          <Route path="/payments" element={<FernandoPayments />} />
          <Route path="/statistics" element={<FernandoStatistics />} />
          <Route path="/communications" element={<FernandoCommunications />} />
          <Route path="/advertising" element={<FernandoAdvertising />} />
          <Route path="/affinities" element={<FernandoAffinities />} />
          <Route path="/filters" element={<FernandoFilters />} />
          <Route path="/user-roles" element={<FernandoUserRoles />} />
          <Route path="/analytics" element={<FernandoAnalytics />} />
          <Route path="/translations" element={<FernandoTranslations />} />
          <Route path="/batches/*" element={<FernandoBatches />} />
          <Route path="/32-day-hotels" element={<Fernando32DayHotels />} />
          <Route path="/notification-logs" element={<FernandoNotificationLogs />} />
          <Route path="/leader-requests" element={React.createElement(React.lazy(() => import("@/components/admin/LeaderRequestsContent").then(m => ({ default: m.LeaderRequestsContent }))))} />
          <Route path="/pdf-submissions" element={<FernandoPDFSubmissions />} />
          <Route path="/price-corrector" element={<FernandoPriceCorrector />} />
          <Route path="/package-creator" element={<FernandoPackageCreator />} />
          <Route path="/stability-tests" element={<StabilityTests />} />
          <Route path="*" element={<Navigate to="/panel-admin" replace />} />
        </Routes>
      </PanelFernandoLayout>
    </AdminAuthGuard>
  );
}
