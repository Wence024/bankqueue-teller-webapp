import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import CustomerDetails from "@/components/CustomerDetails";
import QueueOverview from "@/components/QueueOverview";
import ActionButtons from "@/components/ActionButtons";
import TellerStatus from "@/components/TellerStatus";
import TransactionDetails from "@/components/TransactionDetails";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const [tellerStatus, setTellerStatus] = useState<"available" | "busy" | "away">("available");
  const navigate = useNavigate();
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
  const { data: queueCount = 0 } = useQuery({
    queryKey: ["queueCount", queueType],
    queryFn: async () => {
      if (!queueType) return 0;

      const q = query(
        collection(db, "receipts"),
        where("completed_at", "==", null),
        where("type", "==", queueType.toLowerCase())
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    },
  });

  // Fetch current customer
  const { data: currentCustomer, refetch: refetchCustomer } = useQuery({
    queryKey: ["currentCustomer", queueType],
    queryFn: async () => {
      if (!queueType) return null;

      const q = query(
        collection(db, "receipts"),
        where("completed_at", "==", null),
        where("type", "==", queueType.toLowerCase()),
        orderBy("timestamp", "asc"),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;

      const doc = snapshot.docs[0];
      const data = doc.data();

      const waitingTime = data.timestamp
        ? Math.floor((Date.now() - data.timestamp.toDate().getTime()) / 60000)
        : 0;

      const customerData = {
        id: doc.id,
        name: `Customer ${data.queue_number}`,
        queueNumber: data.queue_number,
        transactionType: data.type,
        priority: data.queue_prefix === "VIP" ? "vip" : "regular",
        accountId: data.account_ID || "N/A",
        waitingTime: `${waitingTime} min`,
      };

      const transactionData = {
        type: data.type,
        account_ID: data.account_ID,
        amount: data.amount,
        firstname: data.firstname,
        lastname: data.lastname,
        monthly_interest: data.monthly_interest,
      };

      return {
        ...customerData,
        ...transactionData,
      };
    },
    enabled: false,
  });

  const handleNext = async () => {
    setTellerStatus("busy");
    const result = await refetchCustomer();

    if (result.error) {
      setTellerStatus("available");
      toast.error(`Error: ${result.error.message}`);
      return;
    }

    if (!result.data) {
      setTellerStatus("available");
      toast.info("No customers in queue");
      return;
    }

    toast.success("Next customer fetched successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Teller Interface
            </h1>
            <p className="text-muted-foreground mt-1 capitalize">
              {queueType?.replace("_", " ")} Queue
            </p>
          </div>
          <div className="flex items-center gap-4">
            <TellerStatus
              status={tellerStatus}
              onStatusChange={setTellerStatus}
            />
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CustomerDetails customer={currentCustomer} />
            <TransactionDetails transaction={currentCustomer} />
          </div>
          <div className="space-y-8">
            <QueueOverview count={queueCount} />
            <ActionButtons
              onNext={handleNext}
              disabled={tellerStatus === "away"}
              customerPresent={!!currentCustomer}
              customerId={currentCustomer?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;