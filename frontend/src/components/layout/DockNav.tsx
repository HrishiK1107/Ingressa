import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  Boxes,
  Search,
} from "lucide-react";

/* ----------------------------------------
   Dock apps
----------------------------------------- */
const apps = [
  { name: "Dashboard", path: "/dashboard", Icon: LayoutDashboard },
  { name: "Findings", path: "/findings", Icon: AlertTriangle },
  { name: "Assets", path: "/assets", Icon: Boxes },
  { name: "Scans", path: "/scans", Icon: Search },
];

/* ----------------------------------------
   Dock Nav (SMOOTH / INERTIAL)
----------------------------------------- */
export default function DockNav() {
  const mouseX = useMotionValue(Infinity);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="
        flex gap-3 px-4 py-3
        rounded-xl
        bg-neutral-900/80 backdrop-blur-md
        border border-neutral-700
        shadow-xl
      "
    >
      {apps.map((app) => (
        <DockIcon
          key={app.path}
          mouseX={mouseX}
          label={app.name}
          Icon={app.Icon}
          active={location.pathname === app.path}
          onClick={() => navigate(app.path)}
        />
      ))}
    </div>
  );
}

/* ----------------------------------------
   Dock Icon (REFERENCE-MATCHED PHYSICS)
----------------------------------------- */
function DockIcon({
  mouseX,
  Icon,
  label,
  active,
  onClick,
}: {
  mouseX: any;
  Icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  /* Distance from cursor */
  const distance = useTransform(mouseX, (x: number) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return x - bounds.x - bounds.width / 2;
  });

  /* Controlled scale range (less aggressive) */
  const widthSync = useTransform(
    distance,
    [-100, 0, 100],
    [40, 56, 40]
  );

  /* Smooth spring — THIS is the magic */
  const width = useSpring(widthSync, {
    mass: 0.12,        // inertia
    stiffness: 140,    // slower response
    damping: 18,       // smooth settle
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onClick={onClick}
      title={label}
      className={`
        flex items-center justify-center
        aspect-square
        rounded-lg
        cursor-pointer
        select-none
        transition-colors
        ${
          active
            ? "bg-blue-600 text-white"
            : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
        }
      `}
    >
      <Icon size={22} strokeWidth={1.75} />
    </motion.div>
  );
}
