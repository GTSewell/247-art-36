
import React, { useState } from 'react';
import CalculatorForm from './calculator/CalculatorForm';
import ResultsDisplay from './calculator/ResultsDisplay';
import { CalculatorFormValues, CalculationResults } from './calculator/schema';
import { calculateResults } from './calculator/calculations';
import { AlertCircle } from "lucide-react";

const SalesCalculator = () => {
  const [calculationResults, setCalculationResults] = useState<CalculationResults>({
    packageCost: 1295, // Default to Signature Artist package cost
    stpRevenue: 0,
    baseCommissionRate: 0.25,
    effectiveCommissionRate: 0.25,
    artworkRevenueBeforeStp: 0,
    artworkRevenueAfterStp: 0,
    totalRevenue: 0,
    profitLoss: -1295, // Initially showing a loss
    breakEven: false,
  });

  const handleFormChange = (values: CalculatorFormValues) => {
    const results = calculateResults(values);
    setCalculationResults(results);
  };

  // Determine the background color and text for the alert section
  const alertBgColor = calculationResults.breakEven ? "bg-zap-green/10 text-zap-green" : "bg-zap-red/10 text-zap-red";

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Artist Sales Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {/* Form Section */}
        <div>
          <CalculatorForm onFormChange={handleFormChange} results={calculationResults} />
        </div>

        {/* Results Section */}
        <div>
          <ResultsDisplay results={calculationResults} />
        </div>
      </div>
      
      {/* Note section at the bottom */}
      <div className={`mt-4 p-3 rounded-md ${alertBgColor} flex items-start`}>
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
  );
};

export default SalesCalculator;
