import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Findings from "@/pages/Findings";
import Assets from "@/pages/Assets";
import Scans from "@/pages/Scans";

import LandingLayout from "@/components/layout/LandingLayout";
import ConsoleLayout from "@/components/layout/ConsoleLayout";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingLayout>
            <Landing />
          </LandingLayout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ConsoleLayout>
            <Dashboard />
          </ConsoleLayout>
        }
      />

      <Route
        path="/findings"
        element={
          <ConsoleLayout>
            <Findings />
          </ConsoleLayout>
        }
      />

      <Route
        path="/assets"
        element={
          <ConsoleLayout>
            <Assets />
          </ConsoleLayout>
        }
      />

      <Route
        path="/scans"
        element={
          <ConsoleLayout>
            <Scans />
          </ConsoleLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
