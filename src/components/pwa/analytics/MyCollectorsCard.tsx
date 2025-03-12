
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Download, MessageSquare } from "lucide-react";
import CollectorTable from "./collectors/CollectorTable";
import { mockCollectors } from "./collectors/mockData";

interface MyCollectorsCardProps {
  onAction?: () => boolean;
}

const MyCollectorsCard: React.FC<MyCollectorsCardProps> = ({ onAction }) => {
  const handleExport = () => {
    if (onAction && onAction()) return;
    // Normal export logic would go here
  };

  const handleMessageAll = () => {
    if (onAction && onAction()) return;
    // Normal message all logic would go here
  };

  // Demo mode always has collectors
  const demoMode = localStorage.getItem('demoSession') === 'active';
  const hasCollectors = demoMode;

  if (!hasCollectors) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            My Collectors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 mb-4 text-gray-400" />
            <p className="text-gray-500">You don't have any collectors yet</p>
            <p className="text-sm text-gray-400 mt-2">
              When people purchase your art, they'll appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            My Collectors
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleMessageAll}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Message All
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CollectorTable collectors={mockCollectors} onMessageClick={handleMessageAll} onViewClick={handleMessageAll} />
      </CardContent>
    </Card>
  );
};

export default MyCollectorsCard;
