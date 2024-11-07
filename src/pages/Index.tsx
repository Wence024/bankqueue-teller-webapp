import { useState } from "react";
import TellerStatus from "../components/TellerStatus";
import QueueOverview from "../components/QueueOverview";
import CustomerDetails from "../components/CustomerDetails";
import ActionButtons from "../components/ActionButtons";
import { useToast } from "../components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, query, where, getDocs, updateDoc, doc, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";

const Index = () => {
  const [tellerStatus, setTellerStatus] = useState<"available" | "busy" | "away">("available");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch queue count
  const { data: queueCount = 0 } = useQuery({
    queryKey: ['queueCount'],
    queryFn: async () => {
      const q = query(
        collection(db, 'queue'),
        where('completed_at', '==', null)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    }
  });

  // Fetch current customer
  const { data: currentCustomer } = useQuery({
    queryKey: ['currentCustomer'],
    queryFn: async () => {
      const q = query(
        collection(db, 'queue'),
        where('completed_at', '==', null),
        orderBy('timestamp', 'asc'),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        name: `Customer ${data.queue_number}`,
        queueNumber: data.queue_number,
        transactionType: data.type,
        priority: data.queue_prefix === 'VIP' ? 'vip' : 'regular',
        accountId: data.account_ID || 'N/A',
        waitingTime: '10 min', // Calculate this based on timestamp
        ...data
      };
    },
    enabled: tellerStatus === 'available'
  });

  // Mark as complete mutation
  const completeMutation = useMutation({
    mutationFn: async (queueId: string) => {
      const queueRef = doc(db, 'queue', queueId);
      await updateDoc(queueRef, {
        completed_at: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentCustomer'] });
      queryClient.invalidateQueries({ queryKey: ['queueCount'] });
      setTellerStatus('available');
      toast({
        title: "Transaction completed",
        description: "Ready for next customer"
      });
    }
  });

  const handleNext = () => {
    setTellerStatus("busy");
  };

  const handleComplete = () => {
    if (currentCustomer?.id) {
      completeMutation.mutate(currentCustomer.id);
    }
  };

  const handleSkip = () => {
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
            <CustomerDetails customer={currentCustomer || null} />
          </div>
          <div className="space-y-8">
            <QueueOverview count={queueCount} />
            <ActionButtons
              onNext={handleNext}
              onComplete={handleComplete}
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