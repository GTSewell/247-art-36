
import React from "react";
import { Users, MessageSquare, Mail, DollarSign, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import CollectorAvatar from "./CollectorAvatar";
import { CollectorTableProps } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

const CollectorTable: React.FC<CollectorTableProps> = ({ 
  collectors, 
  selectedCollectors = [], 
  onSelectCollector 
}) => {
  // Function to determine if collector can be messaged (has email)
  const canContactCollector = (collector: any) => {
    return Boolean(collector.email);
  };

  return (
    <div className="min-w-[900px]">
      <table className="w-full">
        <thead className="sticky top-0 bg-white z-30 border-b shadow-lg">
          <tr className="bg-muted text-left">
            <th className="py-2 px-4 font-semibold">
              <span className="sr-only">Select</span>
            </th>
            <th className="py-2 px-4 font-semibold">Sent</th>
            <th className="py-2 px-4 font-semibold">Name</th>
            <th className="py-2 px-4 font-semibold">Item/s Purchased</th>
            <th className="py-2 px-4 font-semibold">Sales</th>
            <th className="py-2 px-4 font-semibold">Connect</th>
            <th className="py-2 px-4 font-semibold">Email</th>
          </tr>
        </thead>
        <tbody>
          {collectors.map((collector) => (
            <tr key={collector.id} className="border-t">
              <td className="py-3 px-4">
                <Checkbox
                  id={`select-collector-${collector.id}`}
                  checked={selectedCollectors.includes(collector.id)}
                  onCheckedChange={() => onSelectCollector && onSelectCollector(collector.id)}
                  disabled={!canContactCollector(collector)}
                  className={!canContactCollector(collector) ? "opacity-50 cursor-not-allowed" : ""}
                />
              </td>
              <td className="py-3 px-4">
                {collector.messageSent ? (
                  <Check className="h-5 w-5 text-zap-green" />
                ) : (
                  <X className="h-5 w-5 text-zap-red" />
                )}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <CollectorAvatar name={collector.name} avatarUrl={collector.avatarUrl} />
                  <span>{collector.name}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="max-w-[200px]">
                  <ul className="list-disc pl-4 space-y-1">
                    {collector.itemsPurchased.map((item, idx) => (
                      <li key={idx} className="text-sm truncate" title={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-col space-y-1">
                  {collector.sales.map((sale, idx) => (
                    <div key={idx} className="flex items-center text-zap-green">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>
                        {sale.toLocaleString('en-US', { 
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="py-3 px-4">
                {collector.collectorName ? (
                  <button 
                    className="inline-flex items-center text-zap-blue hover:text-zap-red transition-colors"
                    title="Connect with collector"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span className="text-sm">{collector.collectorName}</span>
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm">Not available</span>
                )}
              </td>
              <td className="py-3 px-4">
                {collector.email ? (
                  <button 
                    className="inline-flex items-center text-zap-blue hover:text-zap-red transition-colors"
                    title={`Email: ${collector.email}`}
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    <span className="text-sm truncate max-w-[120px] inline-block">
                      {collector.email}
                    </span>
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm">Not available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollectorTable;
