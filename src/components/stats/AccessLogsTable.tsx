
import React from "react";
import { useAccessLogs } from "./hooks/useAccessLogs";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export const AccessLogsTable: React.FC = () => {
  const { logs, formatDate, isLoading, error, refreshLogs, lastRefresh } = useAccessLogs();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Access Logs</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Last updated: {formatDate(lastRefresh.toISOString())}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshLogs} 
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <p className="text-sm mt-1">Try refreshing the page or check your network connection.</p>
        </div>
      )}
      
      {isLoading && logs.length === 0 ? (
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <p className="mt-2 text-gray-500">Loading access logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
          <p className="text-gray-500">No access logs found.</p>
          <p className="text-sm text-gray-400 mt-1">
            When users access the site with a password, their activity will be logged here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto relative">
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-80 flex justify-center py-2 z-10">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
              <span className="ml-2 text-sm text-gray-600">Refreshing...</span>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>User Name</TableHead>
                {/* We still show the IP address column for legacy data, 
                    but it will display "not-tracked" for new entries */}
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatDate(log.created_at)}</TableCell>
                  <TableCell>{log.site_password}</TableCell>
                  <TableCell>{log.user_provided_name || '—'}</TableCell>
                  <TableCell>{log.ip_address || 'not-tracked'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
