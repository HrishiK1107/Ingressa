import { Navigate, RouteObject } from "react-router-dom";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Findings from "@/pages/Findings";
import Assets from "@/pages/Assets";
import Scans from "@/pages/Scans";

import LandingLayout from "@/components/layout/LandingLayout";
import ConsoleLayout from "@/components/layout/ConsoleLayout";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <LandingLayout>
        <Landing />
      </LandingLayout>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <ConsoleLayout>
        <Dashboard />
      </ConsoleLayout>
    ),
  },

  {
    path: "/findings",
    element: (
      <ConsoleLayout>
        <Findings />
      </ConsoleLayout>
    ),
  },

  {
    path: "/assets",
    element: (
      <ConsoleLayout>
        <Assets />
      </ConsoleLayout>
    ),
  },

  {
    path: "/scans",
    element: (
      <ConsoleLayout>
        <Scans />
      </ConsoleLayout>
    ),
  },

  { path: "*", element: <Navigate to="/" replace /> },
];
