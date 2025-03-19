
import React from 'react';
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { CalculationResults } from './schema';
import { STP_REVENUE_PER_PACK } from './constants';

interface ResultsDisplayProps {
  results: CalculationResults;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <Card className={`p-6 ${results.breakEven ? 'border-green-500 border-2' : 'border-orange-500 border-2'}`}>
      <h3 className="text-xl font-semibold mb-4">Your Results</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Package Cost:</span>
          <span className="font-medium">${results.packageCost.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">STP Revenue (${STP_REVENUE_PER_PACK}/pack):</span>
          <span className="font-medium">${results.stpRevenue.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Base Commission Rate:</span>
          <span className="font-medium">{(results.baseCommissionRate * 100).toFixed(0)}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Effective Commission Rate:</span>
          <span className="font-medium">{(results.effectiveCommissionRate * 100).toFixed(0)}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Artwork Revenue (before STP):</span>
          <span className="font-medium">${results.artworkRevenueBeforeStp.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Artwork Revenue (after STP):</span>
          <span className="font-medium">${results.artworkRevenueAfterStp.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between font-semibold">
          <span>Total Revenue:</span>
          <span>${results.totalRevenue.toFixed(2)}</span>
        </div>
        
        <div className="h-px bg-gray-200 my-2"></div>
        
        <div className="flex justify-between font-bold text-base">
          <span>Profit/Loss:</span>
          <span className={results.profitLoss >= 0 ? "text-green-600" : "text-red-600"}>
            ${results.profitLoss.toFixed(2)}
          </span>
        </div>
        
        <div className={`mt-4 p-3 rounded-md ${results.breakEven ? "bg-green-50 text-green-800" : "bg-orange-50 text-orange-800"} flex items-start`}>
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            {results.breakEven ? (
              <p>You've reached break-even point! Any additional sales will be profit.</p>
            ) : (
              <p>
                You need ${Math.abs(results.profitLoss).toFixed(2)} more in sales to break even.
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
  );
};

export default ResultsDisplay;
