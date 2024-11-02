import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Users } from "lucide-react";

interface QueueOverviewProps {
  count: number;
}

const QueueOverview = ({ count }: QueueOverviewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Queue Overview</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">
          Customers waiting
        </p>
      </CardContent>
    </Card>
  );
};

export default QueueOverview;