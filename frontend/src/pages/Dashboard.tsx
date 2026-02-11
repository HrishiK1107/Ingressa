import Button from "../components/common/Button";
import Badge from "../components/common/Badge";

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard Page</h2>

      <Button onClick={() => console.log("Clicked")}>
        Test Button
      </Button>

      <br /><br />

      <Badge label="CRITICAL" color="red" />
    </div>
  );
}
