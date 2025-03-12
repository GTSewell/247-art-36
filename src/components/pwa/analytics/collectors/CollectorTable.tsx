
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MessageSquare, Eye } from "lucide-react";
import CollectorAvatar from "./CollectorAvatar";
import { Collector } from "./types";

export interface CollectorTableProps {
  collectors: Collector[];
  onMessageClick: (collector: Collector) => void;
  onViewClick: (collector: Collector) => void;
}

const CollectorTable: React.FC<CollectorTableProps> = ({ 
  collectors, 
  onMessageClick, 
  onViewClick 
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Collector</TableHead>
            <TableHead>Purchases</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collectors.map((collector) => (
            <TableRow key={collector.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <CollectorAvatar collector={collector} />
                  <div>
                    <p className="font-medium">{collector.name}</p>
                    <p className="text-xs text-muted-foreground">{collector.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{collector.purchaseCount}</TableCell>
              <TableCell>${collector.totalValue.toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onMessageClick(collector)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onViewClick(collector)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CollectorTable;
