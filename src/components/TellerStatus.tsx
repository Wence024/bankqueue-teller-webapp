import { Button } from "./ui/button";
import { 
  UserCheck, 
  UserMinus, 
  Coffee 
} from "lucide-react";

interface TellerStatusProps {
  status: "available" | "busy" | "away";
  onStatusChange: (status: "available" | "busy" | "away") => void;
}

const TellerStatus = ({ status, onStatusChange }: TellerStatusProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "away":
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      <div className="flex gap-2">
        <Button
          variant={status === "available" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange("available")}
        >
          <UserCheck className="w-4 h-4 mr-1" />
          Available
        </Button>
        <Button
          variant={status === "busy" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange("busy")}
        >
          <UserMinus className="w-4 h-4 mr-1" />
          Busy
        </Button>
        <Button
          variant={status === "away" ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange("away")}
        >
          <Coffee className="w-4 h-4 mr-1" />
          Away
        </Button>
      </div>
    </div>
  );
};

export default TellerStatus;