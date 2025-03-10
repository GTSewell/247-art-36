
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Mail, ExternalLink, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Mock data for collectors
const collectors = [
  {
    id: "c1",
    name: "Sarah Johnson",
    avatarUrl: "",
    itemsPurchased: ["Abstract 1 Fine art print", "Abstract 2 Art Poster"],
    collectorName: "artlover247",
    email: "sarah.j@example.com",
    social: {
      instagram: "sarahjart",
      facebook: "sarahjohnsonart",
    }
  },
  {
    id: "c2",
    name: "Michael Chen",
    avatarUrl: "",
    itemsPurchased: ["Abstract 1 T-shirt"],
    collectorName: "chen_collects",
    email: "m.chen@example.com",
    social: {
      instagram: "chenart",
    }
  },
  {
    id: "c3",
    name: "Anon",
    avatarUrl: "",
    itemsPurchased: ["Landscape oil painting original"],
    collectorName: "",
    email: "",
    social: {}
  },
  {
    id: "c4",
    name: "Emily Torres",
    avatarUrl: "",
    itemsPurchased: ["Abstract 1 Fine art print"],
    collectorName: "emtorres",
    email: "e.torres@example.com",
    social: {
      instagram: "emilyt",
      facebook: "emilytorres",
    }
  },
  {
    id: "c5",
    name: "Anon",
    avatarUrl: "",
    itemsPurchased: ["Cityscape mixed media original"],
    collectorName: "artcollector42",
    email: "",
    social: {}
  }
];

const MyCollectorsCard: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          My Collectors
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[350px] w-full">
          <div className="border-b">
            <table className="w-full">
              <thead>
                <tr className="bg-muted text-left">
                  <th className="py-2 px-4 font-semibold">Name</th>
                  <th className="py-2 px-4 font-semibold">Item/s Purchased</th>
                  <th className="py-2 px-4 font-semibold">Connect</th>
                  <th className="py-2 px-4 font-semibold">Social</th>
                  <th className="py-2 px-4 font-semibold">Email</th>
                </tr>
              </thead>
              <tbody>
                {collectors.map((collector) => (
                  <tr key={collector.id} className="border-t">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={collector.avatarUrl} alt={collector.name} />
                          <AvatarFallback className={cn(
                            collector.name === "Anon" ? "bg-gray-300" : "bg-zap-blue",
                            "text-white"
                          )}>
                            {collector.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
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
                      <div className="flex space-x-2">
                        {Object.keys(collector.social).length > 0 ? (
                          <>
                            {collector.social.instagram && (
                              <button className="text-zap-blue hover:text-zap-red" title="Instagram">
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            )}
                            {collector.social.facebook && (
                              <button className="text-zap-blue hover:text-zap-red" title="Facebook">
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm">Not available</span>
                        )}
                      </div>
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MyCollectorsCard;
