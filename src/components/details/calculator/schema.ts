
import { z } from "zod";

export const calculatorFormSchema = z.object({
  packageType: z.enum(["studio", "feature"]),
  stpPacks: z.coerce.number().min(0, "Must be 0 or more"),
  artworkSales: z.coerce.number().min(0, "Must be $0 or more"),
});

export type CalculatorFormValues = z.infer<typeof calculatorFormSchema>;

export interface CalculationResults {
  packageCost: number;
  stpRevenue: number;
  baseCommissionRate: number;
  effectiveCommissionRate: number;
  artworkRevenueBeforeStp: number;
  artworkRevenueAfterStp: number;
  totalRevenue: number;
  profitLoss: number;
  breakEven: boolean;
}
