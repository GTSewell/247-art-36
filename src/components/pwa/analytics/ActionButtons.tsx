
import React from "react";
import { Button } from "@/components/ui/button";

const ActionButtons: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center gap-4">
      <Button className="w-full md:w-auto">Export Analytics Report</Button>
      <Button className="w-full md:w-auto" variant="secondary">Generate & Send Invoice</Button>
    </div>
  );
};

export default ActionButtons;
