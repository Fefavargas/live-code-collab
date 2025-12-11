import { Terminal, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OutputConsoleProps {
  output: string;
  error?: string;
  executionTime?: number;
  isRunning?: boolean;
}

export function OutputConsole({ output, error, executionTime, isRunning }: OutputConsoleProps) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-code-bg overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-2">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Terminal className="h-4 w-4 text-primary" />
          Output
        </div>
        {executionTime !== undefined && !isRunning && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {executionTime.toFixed(2)}ms
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {isRunning ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Running...
          </div>
        ) : error ? (
          <div className="flex items-start gap-2 text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <pre className="font-mono text-sm whitespace-pre-wrap">{error}</pre>
          </div>
        ) : output ? (
          <pre className={cn(
            "font-mono text-sm whitespace-pre-wrap",
            output.startsWith('[Mock]') ? 'text-warning' : 'text-success'
          )}>
            {output}
          </pre>
        ) : (
          <span className="text-sm text-muted-foreground">
            Click "Run" to execute your code
          </span>
        )}
      </div>
    </div>
  );
}
