import dayjs from "dayjs";

import { db } from "../db";
import { goals, goalCompletions } from "../db/schema";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";

export async function getWeekSummary() {
  return true;
}
