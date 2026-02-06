import { Routes, Route } from "react-router-dom";

import LandingLayout from "../components/layout/LandingLayout";
import ConsoleLayout from "../components/layout/ConsoleLayout";

import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import Findings from "../pages/Findings";
import Assets from "../pages/Assets";
import Scans from "../pages/Scans";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Console */}
      <Route element={<ConsoleLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/findings" element={<Findings />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/scans" element={<Scans />} />
      </Route>
    </Routes>
  );
}
