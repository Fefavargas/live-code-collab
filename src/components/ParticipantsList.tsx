import { Users } from 'lucide-react';
import type { User } from '@/services/mockApi';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ParticipantsListProps {
  participants: User[];
  currentUserId?: string;
}

export function ParticipantsList({ participants, currentUserId }: ParticipantsListProps) {
  return (
    <div className="flex items-center gap-2">
      <Users className="h-4 w-4 text-muted-foreground" />
      <div className="flex -space-x-2">
        {participants.slice(0, 5).map((participant) => (
          <Tooltip key={participant.id}>
            <TooltipTrigger asChild>
              <div
                className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-secondary text-xs font-medium transition-transform hover:scale-110 hover:z-10 ${
                  participant.id === currentUserId ? 'ring-2 ring-primary' : ''
                }`}
              >
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  participant.name.charAt(0).toUpperCase()
                )}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-background" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{participant.name}{participant.id === currentUserId ? ' (You)' : ''}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {participants.length > 5 && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground">
            +{participants.length - 5}
          </div>
        )}
      </div>
    </div>
  );
}
