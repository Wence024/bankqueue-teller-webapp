import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, CreditCard, User } from "lucide-react";

interface CustomerDetailsProps {
  customer: {
    id: string;
    name: string;
    queueNumber: string;
    transactionType: string;
    priority: string;
    accountId: string;
    waitingTime: string;
  } | null;
}

const CustomerDetails = ({ customer }: CustomerDetailsProps) => {
  if (!customer) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No customer currently assigned</p>
          <p className="text-sm">Click "Next" to get the next customer</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Current Customer</CardTitle>
        <Badge variant={customer.priority === "vip" ? "default" : "secondary"}>
          Queue #{customer.queueNumber}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Customer Name</label>
            <p className="font-medium">{customer.name}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Account ID</label>
            <p className="font-medium flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              {customer.accountId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Transaction Type</label>
            <Badge variant="outline" className="capitalize">
              {customer.transactionType}
            </Badge>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Waiting Time</label>
            <p className="font-medium flex items-center text-yellow-600">
              <Clock className="w-4 h-4 mr-2" />
              {customer.waitingTime}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDetails;