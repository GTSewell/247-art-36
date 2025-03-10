
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import CollectorTable from "./collectors/CollectorTable";
import { collectors } from "./collectors/mockData";
import { useCollectorExport } from "./collectors/useCollectorExport";

const MyCollectorsCard: React.FC = () => {
  const isMobile = useIsMobile();
  const { handleDownload } = useCollectorExport(collectors);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          My Collectors
        </CardTitle>
        <Button 
          variant="outline" 
          className="bg-zap-green text-white hover:bg-zap-green/90 border-none flex items-center gap-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          Download List
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className={cn(
          "h-[350px] relative",
          isMobile ? "overflow-x-auto" : ""
        )}>
          <ScrollArea className="h-full">
            <CollectorTable collectors={collectors} />
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyCollectorsCard;
