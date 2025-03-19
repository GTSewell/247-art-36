
import { CalculatorFormValues, CalculationResults } from "./schema";
import { PACKAGE_COSTS, BASE_COMMISSION_RATES, STP_REVENUE_PER_PACK, STP_COMMISSION_REDUCTION_PER_PACK } from "./constants";

export const calculateResults = (values: CalculatorFormValues): CalculationResults => {
  const { packageType, stpPacks, artworkSales } = values;
  
  // Package cost
  const packageCost = PACKAGE_COSTS[packageType];
  
  // STP packs revenue
  const stpRevenue = (stpPacks || 0) * STP_REVENUE_PER_PACK;
  
  // Base commission rate
  const baseCommissionRate = BASE_COMMISSION_RATES[packageType];
  
  // Effective commission rate after STP packs
  let effectiveCommissionRate = Math.max(0, baseCommissionRate - ((stpPacks || 0) * STP_COMMISSION_REDUCTION_PER_PACK));
  
  // Original artwork revenue before and after STP packs
  const artworkRevenueBeforeStp = (artworkSales || 0) * (1 - baseCommissionRate);
  const artworkRevenueAfterStp = (artworkSales || 0) * (1 - effectiveCommissionRate);
  
  // Total revenue
  const totalRevenue = stpRevenue + artworkRevenueAfterStp;
  
  // Profit/Loss
  const profitLoss = totalRevenue - packageCost;
  
  // Break-even
  const breakEven = profitLoss >= 0;
  
  return {
    packageCost,
    stpRevenue,
    baseCommissionRate,
    effectiveCommissionRate,
    artworkRevenueBeforeStp,
    artworkRevenueAfterStp,
    totalRevenue,
    profitLoss,
    breakEven,
  };
};
