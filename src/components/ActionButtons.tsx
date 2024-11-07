import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { 
  UserPlus, 
  CheckCircle2, 
  SkipForward 
} from "lucide-react";

interface ActionButtonsProps {
  onNext: () => void;
  onComplete: () => void;
  onSkip: () => void;
  disabled: boolean;
  customerPresent: boolean;
}

const ActionButtons = ({ 
  onNext, 
  onComplete, 
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
          onClick={onComplete}
          disabled={disabled || !customerPresent}
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Complete Transaction
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