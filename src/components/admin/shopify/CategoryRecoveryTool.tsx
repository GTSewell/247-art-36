import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RotateCcw, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { storeCategories } from '@/components/store/utils/categoryUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CategoryRecoveryToolProps {
  products: any[];
  onRecoveryComplete: () => void;
}

const CategoryRecoveryTool = ({ products, onRecoveryComplete }: CategoryRecoveryToolProps) => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryResults, setRecoveryResults] = useState<any>(null);

  // Smart categorization rules based on product names and types
  const smartCategorizeProduct = (product: any): 'original' | 'signed' | 'sticker' | 'print' | 'collection' | 'merch' => {
    const name = product.name.toLowerCase();
    const tags = product.shopify_tags || [];
    
    // Check for specific keywords in product name
    if (name.includes('original') || name.includes('one of a kind') || name.includes('hand painted')) {
      return 'original';
    }
    
    if (name.includes('limited edition') || name.includes('signed') || name.includes('numbered')) {
      return 'signed';
    }
    
    if (name.includes('sticker') || name.includes('decal') || name.includes('vinyl')) {
      return 'sticker';
    }
    
    if (name.includes('print') || name.includes('poster') || name.includes('canvas') || name.includes('lithograph')) {
      return 'print';
    }
    
    if (name.includes('247') || name.includes('collection') || name.includes('exclusive')) {
      return 'collection';
    }
    
    // Check tags for additional clues
    const tagString = tags.join(' ').toLowerCase();
    if (tagString.includes('sticker')) return 'sticker';
    if (tagString.includes('print')) return 'print';
    if (tagString.includes('original')) return 'original';
    if (tagString.includes('limited')) return 'signed';
    if (tagString.includes('collection')) return 'collection';
    
    // Default to merch for everything else (t-shirts, apparel, accessories)
    return 'merch';
  };

  const performSmartRecovery = async () => {
    setIsRecovering(true);
    const results = {
      updated: 0,
      failed: 0,
      details: [] as any[]
    };

    try {
      // Get products that were incorrectly categorized (have shopify or auto source)
      const productsToFix = products.filter(p => 
        p.category_source === 'shopify' || p.category_source === 'auto' || !p.category_source
      );

      console.log(`Attempting to fix ${productsToFix.length} products`);

      for (const product of productsToFix) {
        try {
          const suggestedCategory = smartCategorizeProduct(product);
          
          // Only update if the suggested category is different
          if (suggestedCategory !== product.category) {
            const { error } = await supabase
              .from('products')
              .update({ 
                category: suggestedCategory,
                category_source: 'auto' // Mark as auto-recovered
              })
              .eq('id', product.id);

            if (error) {
              results.failed++;
              results.details.push({
                id: product.id,
                name: product.name,
                status: 'failed',
                error: error.message,
                oldCategory: product.category,
                suggestedCategory
              });
            } else {
              results.updated++;
              results.details.push({
                id: product.id,
                name: product.name,
                status: 'updated',
                oldCategory: product.category,
                newCategory: suggestedCategory
              });
            }
          } else {
            // Category is already correct, just update source
            const { error } = await supabase
              .from('products')
              .update({ category_source: 'auto' })
              .eq('id', product.id);

            if (!error) {
              results.details.push({
                id: product.id,
                name: product.name,
                status: 'correct',
                category: product.category
              });
            }
          }
        } catch (error) {
          results.failed++;
          results.details.push({
            id: product.id,
            name: product.name,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      setRecoveryResults(results);
      
      if (results.updated > 0) {
        toast.success(`Successfully updated ${results.updated} products!`);
        onRecoveryComplete();
      } else {
        toast.info('No products needed category updates');
      }

    } catch (error) {
      console.error('Recovery failed:', error);
      toast.error('Recovery process failed');
    } finally {
      setIsRecovering(false);
    }
  };

  const markAllAsManual = async () => {
    setIsRecovering(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({ category_source: 'manual' })
        .in('id', products.map(p => p.id));

      if (error) {
        toast.error('Failed to mark products as manual');
      } else {
        toast.success('All products marked as manually categorized - they will not be overwritten in future syncs');
        onRecoveryComplete();
      }
    } catch (error) {
      toast.error('Failed to update products');
    } finally {
      setIsRecovering(false);
    }
  };

  const productsNeedingRecovery = products.filter(p => 
    p.category_source === 'shopify' || p.category_source === 'auto' || !p.category_source
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Category Recovery Tool
        </CardTitle>
        <CardDescription>
          Fix categories that were overwritten during sync and prevent future overwrites
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Found {productsNeedingRecovery.length} products with auto-assigned categories. 
            Use the tools below to fix categorization issues.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Smart Recovery</h4>
            <p className="text-sm text-muted-foreground">
              Automatically re-categorize products based on their names and tags
            </p>
            <Button 
              onClick={performSmartRecovery}
              disabled={isRecovering || productsNeedingRecovery.length === 0}
              className="w-full"
            >
              <RotateCcw className={`h-4 w-4 mr-2 ${isRecovering ? 'animate-spin' : ''}`} />
              Run Smart Recovery
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Protect Current Categories</h4>
            <p className="text-sm text-muted-foreground">
              Mark all current categories as manually set to prevent future overwrites
            </p>
            <Button 
              variant="outline"
              onClick={markAllAsManual}
              disabled={isRecovering}
              className="w-full"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Lock All Categories
            </Button>
          </div>
        </div>

        {recoveryResults && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Recovery Results</h4>
            <div className="text-sm space-y-1">
              <p>✅ Updated: {recoveryResults.updated} products</p>
              <p>❌ Failed: {recoveryResults.failed} products</p>
              
              {recoveryResults.details.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer hover:text-primary">View Details</summary>
                  <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                    {recoveryResults.details.map((detail: any, index: number) => (
                      <div key={index} className="text-xs p-2 bg-background rounded border">
                        <div className="font-medium">{detail.name}</div>
                        {detail.status === 'updated' && (
                          <div className="text-green-600">
                            {detail.oldCategory} → {detail.newCategory}
                          </div>
                        )}
                        {detail.status === 'failed' && (
                          <div className="text-red-600">Failed: {detail.error}</div>
                        )}
                        {detail.status === 'correct' && (
                          <div className="text-blue-600">Already correct: {detail.category}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryRecoveryTool;