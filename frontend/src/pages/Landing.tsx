export default function Landing() {
  return (
    <div
      style={{
        padding: 40,
        cursor: "pointer",
        background: "#111",
        color: "white",
      }}
      onClick={() => console.log("Landing clicked")}
    >
      Landing Page — click me
    </div>
  );
}
