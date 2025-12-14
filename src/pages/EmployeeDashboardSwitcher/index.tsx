import { useAuth } from "../../context/authContext/authProvider";
import TruckerDashboard from "../TruckerDashboard";

export default function EmployeeDashboardSwitcher() {

  const { state } = useAuth();
  const { user } = state;

  switch (user.position) {
    case "truckDriver":
      return <TruckerDashboard/>;
  }

}