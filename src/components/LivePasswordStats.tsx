
import React from "react";
import { PasswordStatsSection } from "./stats/PasswordStatsSection";
import { AccessLogsTable } from "./stats/AccessLogsTable";

export const LivePasswordStats: React.FC = () => {
  return (
    <div className="p-4 space-y-8">
      <PasswordStatsSection />
      <AccessLogsTable />
    </div>
  );
};

export default LivePasswordStats;
