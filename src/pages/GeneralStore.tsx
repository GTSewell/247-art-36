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
import { logger } from "@/utils/logger";
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
  const {
    featuredProducts,
    getProductsForCategory,
    isLoading,
    isGeneratingImages
  } = usePWAStoreProducts();
  const handleThemeToggle = (isDark: boolean) => {
    setDarkMode(isDark);
  };
  useEffect(() => {
    logger.info(`Category changed to: ${selectedCategory}`);
  }, [selectedCategory]);
  const filteredProducts = getProductsForCategory(selectedCategory);
  const handleProductSelect = (product: any, timerState: TimerState) => {
    setSelectedProduct(product);
    setSelectedTimerState(timerState);
  };
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  return <TimerProvider>
      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-background dark:bg-background text-foreground dark:text-foreground">
          <Navigation />
          <main className="container px-4 pt-24 pb-12 mx-0 py-[73px]">
            <div className="flex items-center justify-between mb-4">
              <Alert className="inline-block mb-0 bg-zap-yellow border-zap-yellow text-black py-[3px]">
                <AlertDescription className="text-lg font-bold px-0">This is a mock-up store page for demonstration purposes.</AlertDescription>
              </Alert>
              <ThemeToggle localOnly={true} onToggle={handleThemeToggle} />
            </div>
            
            <FeaturedProducts products={featuredProducts} onProductSelect={handleProductSelect} />

            <TimedEditionModal isOpen={!!selectedProduct} onClose={() => {
            setSelectedProduct(null);
            setSelectedTimerState(null);
          }} product={selectedProduct} timeLeft={selectedTimerState || {
            hours: 0,
            minutes: 0,
            seconds: 0
          }} />

            <FilteredProducts products={filteredProducts} selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} isGeneratingImages={isGeneratingImages} />

            {isLoading && !isGeneratingImages && <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-zap-blue dark:text-zap-blue">Loading products...</div>
              </div>}
          </main>
        </div>
      </div>
    </TimerProvider>;
};
export default GeneralStore;