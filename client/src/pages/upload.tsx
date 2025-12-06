import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { saveItem } from '@/lib/closet-storage';
import { ClothingType, WeatherVibe, WEATHER_CONFIG } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export default function UploadPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [type, setType] = useState<ClothingType>('Top');
  const [selectedTags, setSelectedTags] = useState<WeatherVibe[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: WeatherVibe) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile || !user) {
      toast({ title: t('auth.error'), description: t('upload.error_image'), variant: "destructive" });
      return;
    }
    
    if (selectedTags.length === 0) {
      toast({ title: t('upload.error_tags'), variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      await saveItem(imageFile, type, selectedTags, user.id);
      toast({ title: t('upload.success') });
      setLocation('/closet');
    } catch (error: any) {
      console.error("Upload failed in UI:", error);
      toast({ 
        title: "Upload Failed", 
        description: error.message || "Check console for details", 
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in slide-in-from-bottom-8 duration-500">
      <header>
        <h1 className="text-2xl font-display font-bold">{t('upload.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('upload.subtitle')}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Image Upload Area */}
        <div 
          className="aspect-[3/4] relative rounded-2xl border-2 border-dashed border-border bg-secondary/20 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/30 transition-colors overflow-hidden group"
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white font-medium flex items-center gap-2"><Upload size={18} /> {t('upload.change_photo')}</span>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                <ImageIcon size={32} strokeWidth={1.5} />
              </div>
              <p className="font-medium text-foreground">{t('upload.upload_photo')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('upload.tap_to_select')}</p>
            </div>
          )}
          <Input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
          />
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <Label>{t('upload.category')}</Label>
          <Select value={type} onValueChange={(v) => setType(v as ClothingType)}>
            <SelectTrigger className="h-12 rounded-xl bg-secondary/30 border-border/50">
              <SelectValue placeholder={t('upload.select_type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Top">{t('types.Top')}</SelectItem>
              <SelectItem value="Bottom">{t('types.Bottom')}</SelectItem>
              <SelectItem value="Shoes">{t('types.Shoes')}</SelectItem>
              <SelectItem value="Accessory">{t('types.Accessory')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weather Tags */}
        <div className="space-y-3">
          <Label>{t('upload.weather_vibe')}</Label>
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(WEATHER_CONFIG) as [WeatherVibe, any][]).map(([key, config]) => {
              const isSelected = selectedTags.includes(key);
              return (
                <div 
                  key={key}
                  onClick={() => toggleTag(key)}
                  className={`
                    cursor-pointer rounded-xl p-3 border transition-all duration-200 flex flex-col items-center justify-center gap-2
                    ${isSelected ? `bg-primary/10 border-primary text-primary` : 'bg-secondary/20 border-transparent hover:bg-secondary/40 text-muted-foreground'}
                  `}
                >
                  <span className="text-sm font-medium">{t(`weather.${key.toLowerCase()}`)}</span>
                  <span className="text-xs opacity-70">{config.temp}°C</span>
                </div>
              );
            })}
          </div>
        </div>

        <Button type="submit" className="w-full h-12 rounded-xl text-base font-medium mt-4" disabled={isUploading}>
          {isUploading ? <Loader2 className="animate-spin" /> : t('upload.submit')}
        </Button>
      </form>
    </div>
  );
}
