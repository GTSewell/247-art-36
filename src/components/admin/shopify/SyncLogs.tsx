import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface SyncLog {
  id: string;
  sync_type: string;
  created_at: string;
  products_synced: number;
  products_failed: number;
}

interface SyncLogsProps {
  syncLogs: SyncLog[];
  formatDate: (dateString: string) => string;
}

const SyncLogs = ({ syncLogs, formatDate }: SyncLogsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sync History</CardTitle>
        <CardDescription>
          Recent synchronization activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {syncLogs.length > 0 ? (
          <div className="space-y-3">
            {syncLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium">
                      {log.sync_type} sync completed
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(log.created_at)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    {log.products_synced} synced
                  </p>
                  {log.products_failed > 0 && (
                    <p className="text-sm text-red-600">
                      {log.products_failed} failed
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No sync history available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SyncLogs;