
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import LinktreeDashboard from "@/components/pwa/dashboard/LinktreeDashboard";

const ArtistDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Check if this is the demo account
  const isDemo = user?.email?.includes('demo') || user?.email?.includes('247art');
  
  // Use "demo" as artistId for demo accounts, otherwise use user.id
  const artistId = isDemo ? "demo" : user?.id || null;

  return <LinktreeDashboard artistId={artistId} />;
};

export default ArtistDashboard;
