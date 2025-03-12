
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import CollectorAvatar from "./CollectorAvatar";
import { Collector } from "./types";
import { format } from "date-fns";

interface CollectorTableProps {
  collectors: Collector[];
  onMessageClick: (collector: Collector) => void;
}

const CollectorTable: React.FC<CollectorTableProps> = ({ collectors, onMessageClick }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Collector</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Purchases</TableHead>
            <TableHead>Last Purchase</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collectors.map((collector) => (
            <TableRow key={collector.id}>
              <TableCell>
                <CollectorAvatar collector={collector} />
              </TableCell>
              <TableCell className="font-medium">{collector.name}</TableCell>
              <TableCell>
                {collector.purchaseCount} (${collector.totalValue})
              </TableCell>
              <TableCell>
                {format(new Date(collector.lastPurchase), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMessageClick(collector)}
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CollectorTable;
