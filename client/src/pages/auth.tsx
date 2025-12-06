import { useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;

        // If session exists immediately, it means email confirmation is OFF.
        if (data.session) {
           toast({ title: t('auth.success_login', "Account created! Logging in...") });
           setLocation('/');
        } else {
           // Email confirmation IS required
           toast({ 
             title: t('auth.check_email', "Please check your email to confirm your account."), 
             description: "If you want to skip this, disable 'Confirm Email' in your Supabase Dashboard.",
           });
        }

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setLocation('/');
      }
    } catch (error: any) {
      toast({ 
        title: t('auth.error'), 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Ambient background */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-sm p-8 border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-display font-bold">{t('auth.welcome')}</h1>
          <p className="text-muted-foreground text-sm">{t('app.subtitle')}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('auth.email')}</Label>
            <Input 
              type="email" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-secondary/30 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label>{t('auth.password')}</Label>
            <Input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-secondary/30 border-border/50"
            />
          </div>

          <Button type="submit" className="w-full h-11 rounded-xl" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : (isSignUp ? t('auth.create_account') : t('auth.login'))}
          </Button>
        </form>

        <div className="text-center">
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {isSignUp ? t('auth.have_account') : t('auth.no_account')}
          </button>
        </div>
        
        <div className="text-[10px] text-muted-foreground text-center border-t pt-4 border-border/30">
          {isSignUp && (
            <p>Note: To skip email confirmation, disable "Confirm Email" in your Supabase Auth settings.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
