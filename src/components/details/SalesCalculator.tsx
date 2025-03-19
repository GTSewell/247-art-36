
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, DollarSign, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PACKAGE_COSTS = {
  studio: 995,
  feature: 1495
};

const BASE_COMMISSION_RATES = {
  studio: 0.25, // 25%
  feature: 0.10  // 10%
};

const STP_REVENUE_PER_PACK = 50; // Artist makes $50 per STP pack
const STP_COMMISSION_REDUCTION_PER_PACK = 0.01; // 1% reduction per STP pack

const formSchema = z.object({
  packageType: z.enum(["studio", "feature"]),
  stpPacks: z.coerce.number().min(0, "Must be 0 or more"),
  artworkSales: z.coerce.number().min(0, "Must be $0 or more"),
});

type CalculatorFormValues = z.infer<typeof formSchema>;

const SalesCalculator = () => {
  const [calculationResults, setCalculationResults] = useState({
    packageCost: 0,
    stpRevenue: 0,
    baseCommissionRate: 0,
    effectiveCommissionRate: 0,
    artworkRevenueBeforeStp: 0,
    artworkRevenueAfterStp: 0,
    totalRevenue: 0,
    profitLoss: 0,
    breakEven: false,
  });

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageType: "studio",
      stpPacks: undefined,
      artworkSales: undefined,
    },
  });

  const watchFields = form.watch();

  useEffect(() => {
    calculateResults(watchFields);
  }, [watchFields]);

  const calculateResults = (values: CalculatorFormValues) => {
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
    
    setCalculationResults({
      packageCost,
      stpRevenue,
      baseCommissionRate,
      effectiveCommissionRate,
      artworkRevenueBeforeStp,
      artworkRevenueAfterStp,
      totalRevenue,
      profitLoss,
      breakEven,
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Artist Sales Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Calculate Your Potential</h3>
            
            <Form {...form}>
              <form className="space-y-6">
                <FormField
                  control={form.control}
                  name="packageType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Package Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="studio" id="studio" />
                            <Label htmlFor="studio" className="font-normal">
                              Studio Artist ($995, 25% commission)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="feature" id="feature" />
                            <Label htmlFor="feature" className="font-normal">
                              Feature Artist ($1,495, 10% commission)
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stpPacks"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        STP Packs Sold 
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 ml-1 text-gray-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Each STP pack sold reduces commission by 1%. 
                                Studio Artists need 25 packs to reach 0% commission.
                                Feature Artists need 10 packs to reach 0% commission.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          onChange={onChange}
                          value={value === undefined ? "" : value}
                          placeholder=""
                          {...rest}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="artworkSales"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Original Artwork Sales ($)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                          <Input 
                            type="number" 
                            min="0" 
                            className="pl-10" 
                            onChange={onChange}
                            value={value === undefined ? "" : value}
                            placeholder=""
                            {...rest}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </Card>
        </div>

        {/* Results Section */}
        <div>
          <Card className={`p-6 ${calculationResults.breakEven ? 'border-green-500 border-2' : 'border-orange-500 border-2'}`}>
            <h3 className="text-xl font-semibold mb-4">Your Results</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Package Cost:</span>
                <span className="font-medium">${calculationResults.packageCost.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">STP Revenue (${STP_REVENUE_PER_PACK}/pack):</span>
                <span className="font-medium">${calculationResults.stpRevenue.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Base Commission Rate:</span>
                <span className="font-medium">{(calculationResults.baseCommissionRate * 100).toFixed(0)}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Effective Commission Rate:</span>
                <span className="font-medium">{(calculationResults.effectiveCommissionRate * 100).toFixed(0)}%</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Artwork Revenue (before STP):</span>
                <span className="font-medium">${calculationResults.artworkRevenueBeforeStp.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Artwork Revenue (after STP):</span>
                <span className="font-medium">${calculationResults.artworkRevenueAfterStp.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-semibold">
                <span>Total Revenue:</span>
                <span>${calculationResults.totalRevenue.toFixed(2)}</span>
              </div>
              
              <div className="h-px bg-gray-200 my-2"></div>
              
              <div className="flex justify-between font-bold text-base">
                <span>Profit/Loss:</span>
                <span className={calculationResults.profitLoss >= 0 ? "text-green-600" : "text-red-600"}>
                  ${calculationResults.profitLoss.toFixed(2)}
                </span>
              </div>
              
              <div className={`mt-4 p-3 rounded-md ${calculationResults.breakEven ? "bg-green-50 text-green-800" : "bg-orange-50 text-orange-800"} flex items-start`}>
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  {calculationResults.breakEven ? (
                    <p>You've reached break-even point! Any additional sales will be profit.</p>
                  ) : (
                    <p>
                      You need ${Math.abs(calculationResults.profitLoss).toFixed(2)} more in sales to break even.
                    </p>
                  )}
                  <p className="mt-2 text-xs">
                    Note: Due to sales timing variables, these calculations show the maximum commission you might pay. 
                    The actual commission could be lower depending on when STP packs are sold relative to original artworks.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesCalculator;
