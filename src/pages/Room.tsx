import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { CodeEditor } from '@/components/CodeEditor';
import { OutputConsole } from '@/components/OutputConsole';
import { RoomToolbar } from '@/components/RoomToolbar';
import { useRoom } from '@/hooks/useRoom';
import { authApi, type SupportedLanguage } from '@/services/mockApi';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();

  const {
    room,
    loading,
    error,
    code,
    output,
    isRunning,
    updateCode,
    updateLanguage,
    runCode,
  } = useRoom(roomId || '');

  useEffect(() => {
    if (!user && !loading) {
      navigate(`/login?redirect=/room/${roomId}`);
    }
  }, [user, loading, navigate, roomId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Joining room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-xl font-semibold">Unable to join room</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex flex-1 flex-col gap-4 p-4 pt-20">
        <RoomToolbar
          roomId={room.id}
          language={room.language as SupportedLanguage}
          onLanguageChange={updateLanguage}
          onRun={runCode}
          isRunning={isRunning}
          participants={room.participants}
          currentUserId={user?.id}
        />

        <div className="grid flex-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 min-h-[400px] lg:min-h-0">
            <CodeEditor
              value={code}
              language={room.language}
              onChange={updateCode}
            />
          </div>

          <div className="min-h-[200px] lg:min-h-0">
            <OutputConsole
              output={output?.output || ''}
              error={output?.error}
              executionTime={output?.executionTime}
              isRunning={isRunning}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
