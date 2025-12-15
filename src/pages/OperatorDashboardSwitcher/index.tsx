import { useAuth } from "../../context/authContext/authProvider";
import OperatorDashboard from "../OperatorDashboard";

export default function EmployeeDashboardSwitcher() {

  const { state } = useAuth();
  const { user } = state;

  switch (user.position) {
    case "operator":
      return <OperatorDashboard/>;
  }

}