import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface BaseTransaction {
  type: string;
  account_ID?: string;
}

interface DepositTransaction extends BaseTransaction {
  type: "deposit";
  amount: number;
}

interface OpenAccountTransaction extends BaseTransaction {
  type: "open_account";
  firstname: string;
  lastname: string;
  amount: number;
}

interface CloseAccountTransaction extends BaseTransaction {
  type: "close_account";
  account_ID: string;
}

interface OpenLoanTransaction extends BaseTransaction {
  type: "open_loan";
  account_ID: string;
  amount: number;
  monthly_interest: number;
}

interface PayLoanTransaction extends BaseTransaction {
  type: "pay_loan";
  account_ID: string;
  amount: number;
}

interface WithdrawTransaction extends BaseTransaction {
  type: "withdraw";
  account_ID: string;
  amount: number;
}

type Transaction = 
  | DepositTransaction 
  | OpenAccountTransaction 
  | CloseAccountTransaction 
  | OpenLoanTransaction 
  | PayLoanTransaction 
  | WithdrawTransaction;

interface TransactionDetailsProps {
  transaction: Transaction | null;
}

const TransactionDetails = ({ transaction }: TransactionDetailsProps) => {
  if (!transaction) return null;

  const renderDetails = () => {
    switch (transaction.type) {
      case "deposit":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Account ID</p>
                <p className="font-medium">{transaction.account_ID}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">${transaction.amount.toFixed(2)}</p>
              </div>
            </div>
          </>
        );

      case "open_account":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{`${transaction.firstname} ${transaction.lastname}`}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Initial Deposit</p>
                <p className="font-medium">${transaction.amount.toFixed(2)}</p>
              </div>
            </div>
          </>
        );

      case "close_account":
        return (
          <div>
            <p className="text-sm text-muted-foreground">Account to Close</p>
            <p className="font-medium">{transaction.account_ID}</p>
          </div>
        );

      case "open_loan":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Account ID</p>
                <p className="font-medium">{transaction.account_ID}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Loan Amount</p>
                <p className="font-medium">${transaction.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Interest</p>
                <p className="font-medium">{transaction.monthly_interest}%</p>
              </div>
            </div>
          </>
        );

      case "pay_loan":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Account ID</p>
                <p className="font-medium">{transaction.account_ID}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Amount</p>
                <p className="font-medium">${transaction.amount.toFixed(2)}</p>
              </div>
            </div>
          </>
        );

      case "withdraw":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Account ID</p>
                <p className="font-medium">{transaction.account_ID}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Withdrawal Amount</p>
                <p className="font-medium">${transaction.amount.toFixed(2)}</p>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Transaction Details</CardTitle>
        <Badge>{transaction.type.replace('_', ' ').toUpperCase()}</Badge>
      </CardHeader>
      <CardContent>
        {renderDetails()}
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;