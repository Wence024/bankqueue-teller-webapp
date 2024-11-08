import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { UserPlus, CheckCircle2, SkipForward, Undo2 } from "lucide-react";
import ConfirmationDialog from "./ConfirmationDialog";
import { useQueueOperations } from "@/hooks/useQueueOperations";
import { toast } from "sonner";

interface ActionButtonsProps {
  onNext: () => void;
  disabled: boolean;
  customerPresent: boolean;
  customerId?: string;
}

const ActionButtons = ({ 
  onNext, 
  disabled, 
  customerPresent,
  customerId 
}: ActionButtonsProps) => {
  const [showConfirmComplete, setShowConfirmComplete] = useState(false);
  const [showConfirmSkip, setShowConfirmSkip] = useState(false);
  const [lastAction, setLastAction] = useState<{
    type: "complete" | "skip";
    id: string;
  } | null>(null);

  const { completeMutation, undoMutation } = useQueueOperations();

  const handleComplete = async () => {
    if (!customerId) return;
    
    await completeMutation.mutateAsync({ queueId: customerId });
    setLastAction({ type: "complete", id: customerId });
    setShowConfirmComplete(false);
    toast.success("Transaction completed");
  };

  const handleSkip = async () => {
    if (!customerId) return;
    
    await completeMutation.mutateAsync({ queueId: customerId, isSkipped: true });
    setLastAction({ type: "skip", id: customerId });
    setShowConfirmSkip(false);
    toast.success("Customer skipped");
  };

  const handleUndo = async () => {
    if (!lastAction) return;
    
    await undoMutation.mutateAsync(lastAction.id);
    setLastAction(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
            onClick={onNext}
            disabled={disabled}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Next Customer
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => setShowConfirmComplete(true)}
            disabled={disabled || !customerPresent}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Complete Transaction
          </Button>
          <Button
            className="w-full"
            variant="destructive"
            onClick={() => setShowConfirmSkip(true)}
            disabled={disabled || !customerPresent}
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Skip Customer
          </Button>
          {lastAction && (
            <Button
              className="w-full"
              variant="outline"
              onClick={handleUndo}
              disabled={disabled}
            >
              <Undo2 className="w-4 h-4 mr-2" />
              Undo {lastAction.type === "complete" ? "Complete" : "Skip"}
            </Button>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={showConfirmComplete}
        onClose={() => setShowConfirmComplete(false)}
        onConfirm={handleComplete}
        title="Complete Transaction"
        description="Are you sure you want to complete this transaction?"
        actionLabel="Complete"
      />

      <ConfirmationDialog
        isOpen={showConfirmSkip}
        onClose={() => setShowConfirmSkip(false)}
        onConfirm={handleSkip}
        title="Skip Customer"
        description="Are you sure you want to skip this customer?"
        actionLabel="Skip"
      />
    </>
  );
};

export default ActionButtons;