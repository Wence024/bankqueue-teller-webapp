import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

export const useQueueOperations = () => {
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: async ({ queueId, isSkipped = false }: { queueId: string; isSkipped?: boolean }) => {
      const queueRef = doc(db, "receipts", queueId);
      await updateDoc(queueRef, {
        completed_at: Timestamp.now(),
        skipped: isSkipped,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queueCount"] });
      queryClient.invalidateQueries({ queryKey: ["currentCustomer"] });
      toast.success("Transaction updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Error updating transaction: ${error.message}`);
    },
  });

  const undoMutation = useMutation({
    mutationFn: async (queueId: string) => {
      const queueRef = doc(db, "receipts", queueId);
      await updateDoc(queueRef, {
        completed_at: null,
        skipped: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queueCount"] });
      queryClient.invalidateQueries({ queryKey: ["currentCustomer"] });
      toast.success("Action undone successfully");
    },
    onError: (error: Error) => {
      toast.error(`Error undoing action: ${error.message}`);
    },
  });

  return {
    completeMutation,
    undoMutation,
  };
};