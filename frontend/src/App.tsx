import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Findings from "./pages/Findings";
import Assets from "./pages/Assets";
import Scans from "./pages/Scans";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/findings" element={<Findings />} />
      <Route path="/assets" element={<Assets />} />
      <Route path="/scans" element={<Scans />} />
    </Routes>
  );
}
