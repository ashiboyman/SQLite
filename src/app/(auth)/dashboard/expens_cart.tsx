import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getServerSession } from "next-auth/next"; // NextAuth v4 server helper
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Your NextAuth config
import { DollarSign, FileText } from "lucide-react";

export default async function ExpenseCart() {
    const session = await getServerSession(authOptions);
    const expenses = await QUERIES.getExpenses(
        parseInt(session?.user?.id as string)
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-6 mt-6">
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                    <CardHeader className="pb-4 border-b border-gray-100">
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            Activity Summary
                        </CardTitle>
                        <CardDescription className="text-gray-500">
                            Track your recent expense activities
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {expenses.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No expenses recorded yet
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {expenses.map((expense) => (
                                    <div
                                        key={expense.id}
                                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <DollarSign className="h-5 w-5 text-green-600" />
                                                <span className="text-xl font-bold text-gray-800">
                                                    
                                                    {parseFloat(
                                                        expense.amount.toString()
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {expense.expenseDate
                                                    ? new Date(
                                                          expense.expenseDate
                                                      ).toLocaleDateString(
                                                          "en-US",
                                                          {
                                                              year: "numeric",
                                                              month: "short",
                                                              day: "numeric",
                                                          }
                                                      )
                                                    : "No date"}
                                            </span>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <FileText className="h-4 w-4 text-gray-400 mt-1" />
                                            <p className="text-gray-600">
                                                {expense.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
