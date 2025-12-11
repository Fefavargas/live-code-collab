import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { ParticipantsList } from '@/components/ParticipantsList';
import { Play, Copy, Check, Link2 } from 'lucide-react';
import { useState } from 'react';
import type { User, SupportedLanguage } from '@/services/mockApi';
import { useToast } from '@/hooks/use-toast';

interface RoomToolbarProps {
  roomId: string;
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  onRun: () => void;
  isRunning: boolean;
  participants: User[];
  currentUserId?: string;
}

export function RoomToolbar({
  roomId,
  language,
  onLanguageChange,
  onRun,
  isRunning,
  participants,
  currentUserId,
}: RoomToolbarProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const roomUrl = `${window.location.origin}/room/${roomId}`;

  const copyRoomLink = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      toast({
        title: 'Link copied!',
        description: 'Share this link with your candidates.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the URL manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-3">
      <div className="flex flex-wrap items-center gap-3">
        <LanguageSelector value={language} onChange={onLanguageChange} />
        
        <Button
          variant="glow"
          onClick={onRun}
          disabled={isRunning}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          {isRunning ? 'Running...' : 'Run'}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ParticipantsList participants={participants} currentUserId={currentUserId} />
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyRoomLink}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-success" />
              Copied!
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              Share Room
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
