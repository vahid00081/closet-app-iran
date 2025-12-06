import { useEffect, useState } from 'react';
import { useWeather } from '@/lib/weather-context';
import { getRecommendation } from '@/lib/closet-storage';
import { ClothingItem, ClothingType } from '@/lib/types';
import { RefreshCw, Shirt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';

export function OutfitRecommendation() {
  const { vibe } = useWeather();
  const [outfit, setOutfit] = useState<Partial<Record<ClothingType, ClothingItem>>>({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const refreshOutfit = async () => {
    setLoading(true);
    const newOutfit = await getRecommendation(vibe);
    setOutfit(newOutfit);
    setLoading(false);
  };

  useEffect(() => {
    refreshOutfit();
  }, [vibe]);

  const hasItems = Object.keys(outfit).length > 0;

  const ItemCard = ({ type, item }: { type: ClothingType; item?: ClothingItem }) => (
    <Card className="overflow-hidden aspect-square relative group bg-secondary/30 border-border/50">
      {item ? (
        <>
          <img 
            src={item.imageUrl} 
            alt={type} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <span className="text-xs font-medium text-white/90 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              {t(`types.${type}`)}
            </span>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
          <Shirt className="w-8 h-8" strokeWidth={1.5} />
          <span className="text-xs">{t('outfit.no_item', { type: t(`types.${type}`) })}</span>
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-lg">{t('dashboard.todays_look')}</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={refreshOutfit} 
          className="h-8 w-8 rounded-full hover:bg-secondary"
          disabled={loading}
        >
          <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
        </Button>
      </div>

      {!hasItems && !loading ? (
        <div className="text-center py-10 border border-dashed border-border rounded-2xl bg-secondary/10">
          <p className="text-muted-foreground text-sm mb-4">{t('dashboard.empty_closet')}</p>
          <Link href="/upload">
            <Button size="sm" variant="outline" className="rounded-full">{t('dashboard.add_clothes')}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="wait">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <motion.div 
                  key={`skel-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-square rounded-xl bg-secondary/50 animate-pulse"
                />
              ))
            ) : (
              <>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                   <ItemCard type="Top" item={outfit['Top']} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                   <ItemCard type="Bottom" item={outfit['Bottom']} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                   <ItemCard type="Shoes" item={outfit['Shoes']} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                   <ItemCard type="Accessory" item={outfit['Accessory']} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
