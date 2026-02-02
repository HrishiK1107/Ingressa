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

const apps = [
  { name: "Dashboard", path: "/dashboard", Icon: LayoutDashboard },
  { name: "Findings", path: "/findings", Icon: AlertTriangle },
  { name: "Assets", path: "/assets", Icon: Boxes },
  { name: "Scans", path: "/scans", Icon: Search },
];

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
        rounded-2xl
        glass
        shadow-[0_0_40px_rgba(90,140,255,0.35)]
      "
    >
      {apps.map((app) => (
        <DockIcon
          key={app.path}
          mouseX={mouseX}
          Icon={app.Icon}
          active={location.pathname === app.path}
          onClick={() => navigate(app.path)}
        />
      ))}
    </div>
  );
}

function DockIcon({
  mouseX,
  Icon,
  active,
  onClick,
}: {
  mouseX: any;
  Icon: any;
  active: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (x: number) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return x - bounds.x - bounds.width / 2;
  });

  /* slightly larger movement */
  const widthSync = useTransform(
    distance,
    [-120, 0, 120],
    [40, 60, 40]
  );

  /* snappier spring */
  const width = useSpring(widthSync, {
    stiffness: 320, // ⬆️ faster response
    damping: 22,    // ⬇️ less lag
    mass: 0.08,     // ⬇️ lighter
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onClick={onClick}
      className={`
        flex items-center justify-center
        aspect-square
        rounded-xl
        cursor-pointer
        select-none
        will-change-[width]
        ${
          active
            ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.9)]"
            : "bg-white/5 text-neutral-300 hover:bg-white/10"
        }
      `}
    >
      <Icon size={22} strokeWidth={1.75} />
    </motion.div>
  );
}
