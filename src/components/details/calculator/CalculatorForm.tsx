import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DollarSign, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { calculatorFormSchema, CalculatorFormValues, CalculationResults } from "./schema";
interface CalculatorFormProps {
  onFormChange: (values: CalculatorFormValues) => void;
  results?: CalculationResults;
}
const CalculatorForm: React.FC<CalculatorFormProps> = ({
  onFormChange,
  results
}) => {
  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorFormSchema),
    defaultValues: {
      packageType: "signature",
      stpPacks: undefined,
      artworkSales: undefined
    }
  });
  const watchFields = form.watch();
  React.useEffect(() => {
    onFormChange(watchFields);
  }, [watchFields, onFormChange]);

  // Determine the background color based on profitability
  const headerBgColor = !results ? "bg-zap-red" : results.profitLoss >= 0 ? "bg-zap-green" : "bg-zap-red";
  return <Card className="p-06 py-[35px] rounded-none bg-transparent">
      <h3 className="text-xl font-semibold mb-4">Calculate Your Potential</h3>
      
      <Form {...form}>
        <form className="space-y-6">
          <div className={`${headerBgColor} p-3 rounded-md mb-2`}>
            <h4 className="text-center font-bold text-black text-2xl">Signature Artist</h4>
          </div>

          <FormField control={form.control} name="stpPacks" render={({
          field: {
            onChange,
            value,
            ...rest
          }
        }) => <FormItem>
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
                          Signature Artists need 25 packs to reach 0% commission.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                <FormControl>
                  <Input type="number" min="0" onChange={onChange} value={value === undefined ? "" : value} placeholder="" className="border-2 border-gray-300 focus:border-primary" {...rest} />
                </FormControl>
                <FormMessage />
              </FormItem>} />

          <FormField control={form.control} name="artworkSales" render={({
          field: {
            onChange,
            value,
            ...rest
          }
        }) => <FormItem>
                <FormLabel>Original Artwork Sales ($)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input type="number" min="0" className="pl-10 border-2 border-gray-300 focus:border-primary" onChange={onChange} value={value === undefined ? "" : value} placeholder="" {...rest} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>} />
        </form>
      </Form>
    </Card>;
};
export default CalculatorForm;