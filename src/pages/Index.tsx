import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, orderBy, limit, doc, updateDoc, Timestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import CustomerDetails from "@/components/CustomerDetails";
import QueueOverview from "@/components/QueueOverview";
import ActionButtons from "@/components/ActionButtons";
import TellerStatus from "@/components/TellerStatus";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const [tellerStatus, setTellerStatus] = useState<"available" | "busy" | "away">("available");
  const [queueCount, setQueueCount] = useState(0);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queueType = localStorage.getItem("selectedQueueType");

  useEffect(() => {
    if (!queueType) {
      navigate("/queue-selection");
    }
  }, [queueType, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("selectedQueueType");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Fetch queue count
  const fetchQueueCount = async () => {
    const q = query(
      collection(db, 'queue'),
      where('completed_at', '==', null),
      where('type', '==', queueType)
    );
    const snapshot = await getDocs(q);
    setQueueCount(snapshot.size);
  };

  // Fetch current customer
  const fetchCurrentCustomer = async () => {
    const q = query(
      collection(db, 'queue'),
      where('completed_at', '==', null),
      where('type', '==', queueType),
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
      waitingTime: '10 min',
      ...data
    };
  };

  const completeMutation = useMutation({
    mutationFn: async (queueId: string) => {
      const queueRef = doc(db, 'queue', queueId);
      await updateDoc(queueRef, {
        completed_at: Timestamp.now()
      });
    },
    onSuccess: () => {
      setCurrentCustomer(null);
      setTellerStatus("available");
      queryClient.invalidateQueries({ queryKey: ['queue'] });
      toast("Transaction completed successfully");
    },
    onError: (error: Error) => {
      toast.error(`Error completing transaction: ${error.message}`);
    }
  });

  const handleNext = async () => {
    setTellerStatus("busy");
    fetchQueueCount();
    const customer = await fetchCurrentCustomer();
    setCurrentCustomer(customer);
  };

  const handleComplete = () => {
    if (currentCustomer?.id) {
      completeMutation.mutate(currentCustomer.id);
    }
  };

  const handleSkip = () => {
    setTellerStatus("available");
    toast("Customer skipped");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">Teller Interface</h1>
            <p className="text-muted-foreground mt-1 capitalize">
              {queueType?.replace("_", " ")} Queue
            </p>
          </div>
          <div className="flex items-center gap-4">
            <TellerStatus status={tellerStatus} onStatusChange={setTellerStatus} />
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CustomerDetails customer={currentCustomer} />
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