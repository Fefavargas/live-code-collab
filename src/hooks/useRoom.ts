import { useState, useEffect, useCallback } from 'react';
import { roomApi, codeApi, authApi, type Room, type CodeExecutionResult, type SupportedLanguage } from '@/services/mockApi';

interface UseRoomReturn {
  room: Room | null;
  loading: boolean;
  error: string | null;
  code: string;
  output: CodeExecutionResult | null;
  isRunning: boolean;
  updateCode: (code: string) => void;
  updateLanguage: (language: SupportedLanguage) => void;
  runCode: () => Promise<void>;
}

export function useRoom(roomId: string): UseRoomReturn {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<CodeExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initRoom = async () => {
      try {
        setLoading(true);
        setError(null);

        const user = authApi.getCurrentUser();
        if (!user) {
          setError('Please login to join a room');
          return;
        }

        const joinedRoom = await roomApi.joinRoom(roomId);
        setRoom(joinedRoom);
        setCode(joinedRoom.code);

        // Subscribe to real-time updates
        unsubscribe = roomApi.subscribeToCodeUpdates(roomId, (newCode, userId) => {
          if (userId !== user.id) {
            setCode(newCode);
          }
        });
      } catch (err: any) {
        setError(err.message || 'Failed to join room');
      } finally {
        setLoading(false);
      }
    };

    initRoom();

    return () => {
      unsubscribe?.();
      roomApi.leaveRoom(roomId);
    };
  }, [roomId]);

  const updateCode = useCallback(
    (newCode: string) => {
      setCode(newCode);
      roomApi.updateCode(roomId, newCode);
    },
    [roomId]
  );

  const updateLanguage = useCallback(
    async (language: SupportedLanguage) => {
      if (room) {
        await roomApi.updateLanguage(roomId, language);
        setRoom({ ...room, language });
      }
    },
    [room, roomId]
  );

  const runCode = useCallback(async () => {
    if (!room) return;

    setIsRunning(true);
    setOutput(null);

    try {
      const result = await codeApi.execute(code, room.language);
      setOutput(result);
    } catch (err: any) {
      setOutput({
        output: '',
        error: err.message || 'Execution failed',
        executionTime: 0,
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, room]);

  return {
    room,
    loading,
    error,
    code,
    output,
    isRunning,
    updateCode,
    updateLanguage,
    runCode,
  };
}
