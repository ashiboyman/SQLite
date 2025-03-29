import "server-only";
import { pendingUsers, expenses } from "@/server/db/schema";
import { db } from "@/server/db/index";

import { eq, isNull, and } from "drizzle-orm";
import { redirect } from "next/navigation";

export const QUERIES = {
  
  
  
  

  getExpenses: async function (userId: number) {
    const all = await db
      .select()
      .from(expenses)
      .where(
        eq(expenses.userId, userId),
      );
    return all;
  },
};


