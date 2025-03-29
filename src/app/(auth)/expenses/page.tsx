"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { createExpenseAction } from "@/server/actions/actions"; // adjust path as necessary
import { useSession } from "next-auth/react";
// ShadCN UI Components (adjust the import if you use a different source)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ExpenseFormData = {
    amount: string;
    description: string;
    expenseDate: string;
};
export default function ExpensesPage() {
    const { data: session, status } = useSession();
    console.log(session?.user.id);

    const form = useForm<ExpenseFormData>({
        defaultValues: {
          amount: "",
          description: "",
          expenseDate: "",
        },
      });
    
      const {
        handleSubmit,
        reset,
        formState: { errors },
      } = form;
    
      const [isPending, startTransition] = useTransition();
    
      async function onSubmit(data: ExpenseFormData) {
        const expenseData = {
          // Replace this with the actual authenticated user ID
          userId: parseInt(session?.user.id as string),
          amount: parseFloat(data.amount),
          description: data.description,
          expenseDate: data.expenseDate,
        };
    
        startTransition(async () => {
          try {
            await createExpenseAction(expenseData);
            reset();
          } catch (error) {
            console.error("Error creating expense:", error);
          }
        });
      }
    return (
        <div>
           <Card className="max-w-md mx-auto mt-10 shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Create Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount Field */}
            <FormField
              control={form.control}
              name="amount"
              rules={{ required: "Amount is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter the amount"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage>{errors.amount?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Expense description"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage>{errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Expense Date Field */}
            <FormField
              control={form.control}
              name="expenseDate"
              rules={{ required: "Expense Date is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage>{errors.expenseDate?.message}</FormMessage>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Submitting..." : "Create Expense"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
        </div>
    );
}
