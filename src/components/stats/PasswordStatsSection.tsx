
import React from "react";
import { usePasswordStats } from "./hooks/usePasswordStats";
import { PasswordStats } from "./types";

export const PasswordStatsSection: React.FC = () => {
  const {
    stats,
    isUpdating,
    recipientName,
    setRecipientName,
    handleRecipientUpdate,
    saveRecipientName
  } = usePasswordStats();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Live Password Usage Statistics</h2>
      {stats.map((stat: PasswordStats) => (
        <div key={stat.site_password} className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold">{stat.site_password}</h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-600">Total Uses</p>
              <p className="text-lg font-bold">{stat.usage_count}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Unique IPs</p>
              <p className="text-lg font-bold">{stat.unique_ip_count}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Recipient</p>
              {isUpdating === stat.site_password ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="text-sm border px-1 rounded"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter recipient name"
                  />
                  <button 
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => saveRecipientName(stat.site_password)}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold">{stat.recipient_name || "—"}</p>
                  <button 
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    onClick={() => handleRecipientUpdate(stat.site_password)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
