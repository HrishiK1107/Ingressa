export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        className="px-6 py-3 rounded-lg bg-card cursor-pointer"
        onClick={() => console.log("Landing clicked")}
      >
        Landing Page — click me
      </button>
    </div>
  );
}
