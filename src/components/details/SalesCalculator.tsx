
import React, { useState } from 'react';
import CalculatorForm from './calculator/CalculatorForm';
import ResultsDisplay from './calculator/ResultsDisplay';
import { CalculatorFormValues, CalculationResults } from './calculator/schema';
import { calculateResults } from './calculator/calculations';

const SalesCalculator = () => {
  const [calculationResults, setCalculationResults] = useState<CalculationResults>({
    packageCost: 1295, // Default to Signature Artist package cost
    stpRevenue: 0,
    baseCommissionRate: 0.25,
    effectiveCommissionRate: 0.25,
    artworkRevenueBeforeStp: 0,
    artworkRevenueAfterStp: 0,
    totalRevenue: 0,
    profitLoss: 0,
    breakEven: false,
  });

  const handleFormChange = (values: CalculatorFormValues) => {
    const results = calculateResults(values);
    setCalculationResults(results);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Artist Sales Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <CalculatorForm onFormChange={handleFormChange} />
        </div>

        {/* Results Section */}
        <div>
          <ResultsDisplay results={calculationResults} />
        </div>
      </div>
    </div>
  );
};

export default SalesCalculator;
