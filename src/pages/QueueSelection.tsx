import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { onAuthStateChanged } from "firebase/auth";

const QUEUE_TYPES = [
  "deposit",
  "withdraw",
  "open_account",
  "open_loan",
  "pay_loan",
  "close_account",
];

const QueueSelection = () => {
  const [selectedType, setSelectedType] = useState("");
  const [takenTypes, setTakenTypes] = useState<string[]>([]);
  const navigate = useNavigate();

  // Check authentication status and cleanup on unmount
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // User is logged out, clean up their active_tellers document
        const userId = auth.currentUser?.uid;
        if (userId) {
          try {
            await deleteDoc(doc(db, "active_tellers", userId));
          } catch (error) {
            console.error("Error cleaning up active_tellers:", error);
          }
        }
        navigate("/login");
      }
    });

    // Cleanup function
    return () => {
      unsubscribeAuth();
      // Clean up active_tellers document when component unmounts
      const userId = auth.currentUser?.uid;
      if (userId) {
        deleteDoc(doc(db, "active_tellers", userId)).catch(console.error);
      }
    };
  }, [navigate]);

  useEffect(() => {
    const fetchTakenTypes = async () => {
      const tellersRef = collection(db, "active_tellers");
      const q = query(tellersRef, where("active", "==", true));
      const snapshot = await getDocs(q);
      const types = snapshot.docs.map((doc) => doc.data().queueType);
      setTakenTypes(types);
    };

    fetchTakenTypes();
  }, []);

  const handleTypeSelection = async (type: string) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        toast.error("Not authenticated");
        return;
      }

      const tellerRef = doc(db, "active_tellers", userId);
      
      // Set the document with server timestamp
      await setDoc(tellerRef, {
        tellerId: userId,
        queueType: type,
        active: true,
        timestamp: new Date(),
        lastSeen: new Date() // Add this field for tracking active status
      });

      localStorage.setItem("selectedQueueType", type);
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Select Queue Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {QUEUE_TYPES.map((type) => (
              <Button
                key={type}
                onClick={() => handleTypeSelection(type)}
                disabled={takenTypes.includes(type)}
                variant={selectedType === type ? "default" : "outline"}
                className="h-24 text-lg capitalize"
              >
                {type.replace("_", " ")}
                {takenTypes.includes(type) && (
                  <span className="block text-xs text-red-500 mt-2">
                    Currently taken
                  </span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueSelection;