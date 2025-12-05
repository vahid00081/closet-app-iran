import { WeatherWidget } from '@/components/WeatherWidget';
import { OutfitRecommendation } from '@/components/OutfitRecommendation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'wouter';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold">Good Morning</h1>
          <p className="text-muted-foreground text-sm">Ready to get dressed?</p>
        </div>
        <Link href="/upload">
          <Button size="icon" className="rounded-full h-10 w-10 shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </header>

      <WeatherWidget />
      
      <OutfitRecommendation />
    </div>
  );
}
