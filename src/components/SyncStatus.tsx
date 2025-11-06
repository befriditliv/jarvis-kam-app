import { Cloud, CloudOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebriefQueue } from "@/hooks/useDebriefQueue";

export const SyncStatus = () => {
  const { queue, pendingCount, isOnline, retryFailed } = useDebriefQueue();

  if (pendingCount === 0 && queue.length === 0) return null;

  const getStatusIcon = () => {
    if (!isOnline) {
      return <CloudOff className="h-4 w-4 text-destructive" />;
    }
    
    const hasSubmitting = queue.some(q => q.status === 'submitting');
    const hasFailed = queue.some(q => q.status === 'failed');
    
    if (hasSubmitting) {
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    }
    
    if (hasFailed) {
      return <AlertCircle className="h-4 w-4 text-warning" />;
    }
    
    return <Cloud className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (!isOnline) return "Offline";
    
    const submitting = queue.filter(q => q.status === 'submitting').length;
    const pending = queue.filter(q => q.status === 'pending').length;
    const failed = queue.filter(q => q.status === 'failed').length;
    
    if (submitting > 0) return `Syncing ${submitting}...`;
    if (failed > 0) return `${failed} failed`;
    if (pending > 0) return `${pending} pending`;
    
    return "Synced";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 px-3 rounded-full"
        >
          {getStatusIcon()}
          <span className="text-xs font-medium">{getStatusText()}</span>
          {pendingCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {pendingCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Sync Status</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isOnline ? (
                <>
                  <Cloud className="h-3 w-3" />
                  Online
                </>
              ) : (
                <>
                  <CloudOff className="h-3 w-3" />
                  Offline
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-2 rounded-lg bg-muted/50"
              >
                <div className="mt-0.5">
                  {item.status === 'submitting' && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {item.status === 'pending' && (
                    <Cloud className="h-4 w-4 text-muted-foreground" />
                  )}
                  {item.status === 'submitted' && (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                  {item.status === 'failed' && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    Meeting Debrief
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.status === 'submitting' && 'Submitting to IOengage...'}
                    {item.status === 'pending' && 'Waiting for connection'}
                    {item.status === 'submitted' && 'Successfully synced'}
                    {item.status === 'failed' && 'Failed to sync'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {queue.some(q => q.status === 'failed') && (
            <Button
              variant="outline"
              size="sm"
              onClick={retryFailed}
              className="w-full"
            >
              Retry Failed
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
