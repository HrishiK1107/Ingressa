import type { RouteObject } from "react-router-dom";
import ConsoleLayout from "../components/layout/ConsoleLayout";
import Dashboard from "../pages/Dashboard";
import Findings from "../pages/Findings";
import Assets from "../pages/Assets";
import Scans from "../pages/Scans";

export const routes: RouteObject[] = [
  {
    element: <ConsoleLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/findings",
        element: <Findings />,
      },
      {
        path: "/assets",
        element: <Assets />,
      },
      {
        path: "/scans",
        element: <Scans />,
      },
    ],
  },
];
