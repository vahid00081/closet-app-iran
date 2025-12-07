import { useEffect, useState } from "react";
import { getItems, deleteItem } from "@/lib/closet-storage";
import { ClothingItem } from "@/lib/types";
import { Trash2, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function ClosetPage() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  const loadItems = async () => {
    setLoading(true);
    const data = await getItems();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id: string, imagePath?: string) => {
    // Optimistic update
    const originalItems = [...items];
    setItems(items.filter((item) => item.id !== id));

    await deleteItem(id, imagePath);
    toast({ title: "Item deleted" });

    // Verify sync
    loadItems();
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
          <Tag className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <h2 className="text-xl font-display font-semibold">
          {t("closet.empty_title")}
        </h2>
        <p className="text-muted-foreground max-w-[200px]">
          {t("closet.empty_desc")}
        </p>
        <Link href="/upload">
          <Button className="mt-4 rounded-full px-8">
            {t("closet.add_first")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-display font-bold">{t("closet.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("closet.count", { count: items.length })}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary/30 border border-border/50"
          >
            <img
              src={item.imageUrl}
              alt={item.type}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0"
                  onClick={() => handleDelete(item.id, item.imagePath)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className="translate-y-[10px] group-hover:translate-y-0 transition-all duration-300">
                <span className="text-xs font-medium text-white bg-white/20 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 inline-block mb-1">
                  {t(`types.${item.type}`)}
                </span>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(item.weatherTags) &&
                    item.weatherTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-black/50 text-white/80 px-1.5 py-0.5 rounded-sm"
                      >
                        {t(`weather.${tag.toLowerCase()}`)}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
