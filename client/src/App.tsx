import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { WeatherProvider } from "@/lib/weather-context";
import { Layout } from "@/components/Layout";

import Dashboard from "@/pages/dashboard";
import ClosetPage from "@/pages/closet";
import UploadPage from "@/pages/upload";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/closet" component={ClosetPage} />
        <Route path="/upload" component={UploadPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WeatherProvider>
        <Router />
        <Toaster />
      </WeatherProvider>
    </QueryClientProvider>
  );
}

export default App;
