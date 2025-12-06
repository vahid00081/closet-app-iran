import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { WeatherProvider } from "@/lib/weather-context";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Layout } from "@/components/Layout";
import { Loader2 } from "lucide-react";

import Dashboard from "@/pages/dashboard";
import ClosetPage from "@/pages/closet";
import UploadPage from "@/pages/upload";
import SettingsPage from "@/pages/settings";
import AuthPage from "@/pages/auth";
import NotFound from "@/pages/not-found";
import React from "react";

// Wrapper for protected routes
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!loading && !user) {
      setLocation("/auth");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return user ? (
    <Layout>
      <Component />
    </Layout>
  ) : null;
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>
      
      <Route path="/closet">
        <ProtectedRoute component={ClosetPage} />
      </Route>
      
      <Route path="/upload">
        <ProtectedRoute component={UploadPage} />
      </Route>

      <Route path="/settings">
        <ProtectedRoute component={SettingsPage} />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WeatherProvider>
          <Router />
          <Toaster />
        </WeatherProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
