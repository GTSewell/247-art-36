
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DollarSign, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { calculatorFormSchema, CalculatorFormValues } from "./schema";

interface CalculatorFormProps {
  onFormChange: (values: CalculatorFormValues) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onFormChange }) => {
  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorFormSchema),
    defaultValues: {
      packageType: "studio",
      stpPacks: undefined,
      artworkSales: undefined,
    },
  });

  const watchFields = form.watch();

  React.useEffect(() => {
    onFormChange(watchFields);
  }, [watchFields, onFormChange]);

  return (
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
  );
};

export default CalculatorForm;
