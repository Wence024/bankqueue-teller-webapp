import { Button } from "./ui/button";
import { 
  UserPlus, 
  Bell, 
  SkipForward 
} from "lucide-react";

interface ActionButtonsProps {
  onNext: () => void;
  onCall: () => void;
  onSkip: () => void;
  disabled: boolean;
  customerPresent: boolean;
}

const ActionButtons = ({ 
  onNext, 
  onCall, 
  onSkip, 
  disabled, 
  customerPresent 
}: ActionButtonsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full"
          onClick={onNext}
          disabled={disabled || customerPresent}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Next Customer
        </Button>
        <Button
          className="w-full"
          variant="secondary"
          onClick={onCall}
          disabled={disabled || !customerPresent}
        >
          <Bell className="w-4 h-4 mr-2" />
          Call Customer
        </Button>
        <Button
          className="w-full"
          variant="destructive"
          onClick={onSkip}
          disabled={disabled || !customerPresent}
        >
          <SkipForward className="w-4 h-4 mr-2" />
          Skip Customer
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActionButtons;