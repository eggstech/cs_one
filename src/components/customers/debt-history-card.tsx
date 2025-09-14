import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Customer } from "@/lib/types";
import { DollarSign } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { format } from "date-fns";
import { Badge } from "../ui/badge";

interface DebtHistoryCardProps {
    debt: NonNullable<Customer['debt']>;
}

export function DebtHistoryCard({ debt }: DebtHistoryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Debt &amp; Credit
                </CardTitle>
                 <CardDescription>Customer account balance and history</CardDescription>
            </div>
            <div className="text-right">
                <p className="text-sm text-muted-foreground">Current Debt</p>
                <p className="text-2xl font-bold text-destructive">${debt.current.toFixed(2)}</p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {debt.history.length > 0 ? debt.history.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{format(new Date(item.date), "PP")}</TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell className="text-right">
                    <Badge variant={item.amount > 0 ? 'destructive' : 'secondary'} className="font-mono">
                       {item.amount > 0 ? '+' : ''}${item.amount.toFixed(2)}
                    </Badge>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No debt history.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
