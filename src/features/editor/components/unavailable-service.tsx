import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UnavailableServiceProps {
  title: string;
  message: string;
  onRetry: () => void;
}

const UnavailableService = ({ title, message, onRetry }: UnavailableServiceProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <AlertTriangle className="h-10 w-10 text-red-500" />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button onClick={onRetry} className="w-full max-w-xs mt-4">
        Retry
      </Button>
    </div>
  );
};

export default UnavailableService;
