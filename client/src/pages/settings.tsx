import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { signOut } = useAuth();

  const handleClearCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      
      // We also want to clear Supabase auth tokens specifically if they exist
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('sb-')) {
           localStorage.removeItem(key);
        }
      });

      toast({
        title: "Cache Cleared",
        description: "Local storage has been wiped. Reloading app...",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to clear cache.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage app preferences</p>
      </header>

      <div className="space-y-4">
        <Card className="p-4 bg-secondary/10 border-border/50">
          <h3 className="font-medium mb-2 text-destructive">Danger Zone</h3>
          <p className="text-xs text-muted-foreground mb-4">
            If you are experiencing upload errors or login loops, try clearing the local cache.
            This will log you out.
          </p>
          <Button 
            variant="destructive" 
            onClick={handleClearCache}
            className="w-full flex items-center gap-2"
          >
            <Trash2 size={16} />
            Clear Local Cache & Reload
          </Button>
        </Card>

        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full flex items-center gap-2 h-12"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
