
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QUERIES } from "@/server/db/queries";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next"; // NextAuth v4 server helper
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Your NextAuth config

export default async function ExpenseCart() {
    const session = await getServerSession(authOptions);


    const expenses = await QUERIES.getExpenses(parseInt(session?.user?.id as string));
    // console.log(expenses);
    
    return (
        <>
            <div className="grid grid-cols-1 gap-6 mt-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Activity Summary</CardTitle>
          <CardDescription>
            Your recent activity statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="border-b last:border-b-0 py-4 px-2 space-y-1"
            >
              <div className="flex justify-between">
                <span className="font-semibold">Amount:</span>
                <span>
                  ${parseFloat(expense.amount.toString()).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="font-semibold">Description:</span>{" "}
                {expense.description}
              </div>
              <div>
                <span className="font-semibold">Expense Date:</span>{" "}
                {expense.expenseDate}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
        </>
    );
}
