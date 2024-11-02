import { useState } from "react";
import TellerStatus from "../components/TellerStatus";
import QueueOverview from "../components/QueueOverview";
import CustomerDetails from "../components/CustomerDetails";
import ActionButtons from "../components/ActionButtons";
import { useToast } from "../components/ui/use-toast";

const Index = () => {
  const [tellerStatus, setTellerStatus] = useState<"available" | "busy" | "away">("available");
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [queueCount, setQueueCount] = useState(12);
  const { toast } = useToast();

  const handleNext = () => {
    // Simulated customer data - in real app would come from API
    setCurrentCustomer({
      id: "C123",
      name: "John Smith",
      queueNumber: "A045",
      transactionType: "deposit",
      priority: "regular",
      accountId: "1234567890",
      waitingTime: "10 min",
    });
    setTellerStatus("busy");
    toast({
      title: "New customer assigned",
      description: "Queue number A045 has been assigned to you.",
    });
  };

  const handleCall = () => {
    if (currentCustomer) {
      toast({
        title: "Customer called",
        description: `Now calling queue number ${currentCustomer.queueNumber}`,
      });
    }
  };

  const handleSkip = () => {
    setCurrentCustomer(null);
    setTellerStatus("available");
    toast({
      title: "Customer skipped",
      description: "Ready for next customer",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Teller Interface</h1>
          <TellerStatus status={tellerStatus} onStatusChange={setTellerStatus} />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CustomerDetails customer={currentCustomer} />
          </div>
          <div className="space-y-8">
            <QueueOverview count={queueCount} />
            <ActionButtons
              onNext={handleNext}
              onCall={handleCall}
              onSkip={handleSkip}
              disabled={tellerStatus === "away"}
              customerPresent={!!currentCustomer}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;