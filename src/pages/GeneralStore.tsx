
import { useState, useEffect } from "react";
import Navigation from "@/components/navigation/Navigation";
import { toast } from "sonner";
import TimedEditionModal from "@/components/store/TimedEditionModal";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import FilteredProducts from "@/components/store/FilteredProducts";
import { TimerProvider } from "@/contexts/TimerContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ThemeToggle from "@/components/ThemeToggle";
import { usePWAStoreProducts } from "@/hooks/usePWAStoreProducts";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2 } from "lucide-react";

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
}

const GeneralStore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('print');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedTimerState, setSelectedTimerState] = useState<TimerState | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  
  const {
    featuredProducts,
    getProductsForCategory,
    generateProductImages,
    isLoading
  } = usePWAStoreProducts();

  const handleThemeToggle = (isDark: boolean) => {
    setDarkMode(isDark);
  };

  const filteredProducts = getProductsForCategory(selectedCategory);

  const handleProductSelect = (product: any, timerState: TimerState) => {
    setSelectedProduct(product);
    setSelectedTimerState(timerState);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleGenerateImages = async () => {
    setIsGeneratingImages(true);
    toast.info("Generating product images, this may take a minute...");
    try {
      await generateProductImages();
      toast.success("Product images generated successfully!");
    } catch (error) {
      toast.error("Failed to generate product images");
    } finally {
      setIsGeneratingImages(false);
    }
  };

  return (
    <TimerProvider>
      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-background dark:bg-background text-foreground dark:text-foreground">
          <Navigation />
          <main className="container mx-auto px-4 pt-24 pb-12">
            <div className="flex justify-between items-center mb-4">
              <Button 
                onClick={handleGenerateImages} 
                disabled={isGeneratingImages}
                className="flex items-center gap-2 bg-zap-blue hover:bg-zap-blue/90"
              >
                {isGeneratingImages ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
                {isGeneratingImages ? "Generating Images..." : "Generate Product Images"}
              </Button>
              <ThemeToggle localOnly={true} onToggle={handleThemeToggle} />
            </div>
            
            <Alert className="mb-6 bg-zap-yellow border-zap-yellow text-black">
              <AlertDescription className="text-lg font-bold">
                This is a mock-up Storefront page, purely for demonstration purposes. It will display ALL artists original artworks, merch & fine art prints & limited timed edition drops etc. Each artist will have their artworks & prints available on your very own ATLAS 'Link in Bio' profile.
              </AlertDescription>
            </Alert>
            
            <FeaturedProducts 
              products={featuredProducts}
              onProductSelect={handleProductSelect}
            />

            <TimedEditionModal
              isOpen={!!selectedProduct}
              onClose={() => {
                setSelectedProduct(null);
                setSelectedTimerState(null);
              }}
              product={selectedProduct}
              timeLeft={selectedTimerState || { hours: 0, minutes: 0, seconds: 0 }}
            />

            <FilteredProducts
              products={filteredProducts}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />

            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-zap-blue dark:text-zap-blue">Loading products...</div>
              </div>
            )}
          </main>
        </div>
      </div>
    </TimerProvider>
  );
};

export default GeneralStore;
