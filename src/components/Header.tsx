import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Code2, LogOut, User } from 'lucide-react';
import { authApi } from '@/services/mockApi';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  showAuth?: boolean;
}

export function Header({ showAuth = true }: HeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = authApi.getCurrentUser();

  const handleLogout = async () => {
    await authApi.logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Code<span className="text-gradient">Collab</span>
          </span>
        </Link>

        {showAuth && (
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:inline">{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="glow" asChild>
                  <Link to="/login?mode=register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
