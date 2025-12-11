import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { roomApi, authApi } from '@/services/mockApi';
import { useToast } from '@/hooks/use-toast';
import { Code2, Users, Zap, Shield, ArrowRight, Play } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Real-time Collaboration',
    description: 'Code together with candidates in real-time. See changes instantly as they happen.',
  },
  {
    icon: Zap,
    title: 'In-Browser Execution',
    description: 'Run JavaScript code directly in the browser. No backend required.',
  },
  {
    icon: Shield,
    title: 'Secure Rooms',
    description: 'Share unique room links with candidates. Only invited participants can join.',
  },
  {
    icon: Code2,
    title: 'Multi-Language Support',
    description: 'Syntax highlighting for JavaScript, Python, Java, C++, and more.',
  },
];

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    const user = authApi.getCurrentUser();
    
    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please sign in to create a coding room.',
      });
      navigate('/login');
      return;
    }

    setIsCreating(true);
    try {
      const room = await roomApi.createRoom();
      toast({
        title: 'Room created!',
        description: 'Share the room link with your candidates.',
      });
      navigate(`/room/${room.id}`);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to create room',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(200_100%_50%/0.1),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              Real-time collaborative coding
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Code Interviews
              <br />
              <span className="text-gradient">Made Simple</span>
            </h1>
            
            <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
              Create a room, share the link, and start coding together in real-time.
              Perfect for technical interviews and pair programming sessions.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                variant="glow"
                size="xl"
                onClick={handleCreateRoom}
                disabled={isCreating}
                className="w-full sm:w-auto"
              >
                {isCreating ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Create Room
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="xl"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Everything you need</h2>
            <p className="text-muted-foreground">
              Built for seamless technical interviews
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-glow animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl border border-border bg-card p-2 shadow-card">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/70" />
                  <div className="h-3 w-3 rounded-full bg-warning/70" />
                  <div className="h-3 w-3 rounded-full bg-success/70" />
                </div>
                <span className="ml-4 text-sm text-muted-foreground font-mono">room-abc123</span>
              </div>
              <div className="aspect-video rounded-lg bg-code-bg p-6 font-mono text-sm">
                <div className="text-muted-foreground">
                  <span className="text-primary">{'// '}</span>Welcome to CodeCollab!
                </div>
                <div className="mt-2">
                  <span className="text-purple-400">function</span>
                  <span className="text-yellow-300"> greet</span>
                  <span className="text-foreground">(</span>
                  <span className="text-orange-300">name</span>
                  <span className="text-foreground">) {'{'}</span>
                </div>
                <div className="pl-4">
                  <span className="text-purple-400">return</span>
                  <span className="text-foreground"> `Hello, </span>
                  <span className="text-foreground">{'${'}</span>
                  <span className="text-orange-300">name</span>
                  <span className="text-foreground">{'}'}!`;</span>
                </div>
                <div className="text-foreground">{'}'}</div>
                <div className="mt-4">
                  <span className="text-blue-400">console</span>
                  <span className="text-foreground">.log(greet(</span>
                  <span className="text-green-400">"World"</span>
                  <span className="text-foreground">));</span>
                </div>
                <div className="mt-4 border-t border-border pt-4">
                  <span className="text-success">{'>'} Hello, World!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>CodeCollab — Built for technical interviews</p>
        </div>
      </footer>
    </div>
  );
}
