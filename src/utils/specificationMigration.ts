import { supabase } from '@/integrations/supabase/client';

// Migration mapping for existing specifications to new categories
const SPECIFICATION_MIGRATION_MAP: Record<string, string> = {
  'Material': 'Media',
  'Dimensions': 'Size',
  'Weight': 'Weight',
  'Color': 'Color',
  'Style': 'Style',
  'Edition Size': 'Edition'
};

export const migrateExistingSpecifications = async () => {
  try {
    console.log('Starting specification migration...');
    
    // Get all products with specifications
    const { data: products, error } = await supabase
      .from('products')
      .select('id, specifications')
      .not('specifications', 'is', null);

    if (error) throw error;

    let migrationCount = 0;
    
    for (const product of products) {
      const currentSpecs = (product.specifications as Record<string, any>) || {};
      const migratedSpecs = { ...currentSpecs };
      let hasChanges = false;

      // Migrate old specification keys to new categories
      for (const [oldKey, newKey] of Object.entries(SPECIFICATION_MIGRATION_MAP)) {
        if (currentSpecs[oldKey] && !currentSpecs[newKey]) {
          migratedSpecs[newKey] = currentSpecs[oldKey];
          delete migratedSpecs[oldKey];
          hasChanges = true;
        }
      }

      // Update the product if there were changes
      if (hasChanges) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ specifications: migratedSpecs })
          .eq('id', product.id);

        if (updateError) {
          console.error(`Failed to migrate product ${product.id}:`, updateError);
        } else {
          migrationCount++;
          console.log(`Migrated product ${product.id} specifications`);
        }
      }
    }

    console.log(`Migration complete. Updated ${migrationCount} products.`);
    return { success: true, migratedCount: migrationCount };
    
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
};

// Function to populate initial specification options from existing data
export const populateSpecificationOptions = async () => {
  try {
    console.log('Populating specification options from existing data...');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('specifications')
      .not('specifications', 'is', null);

    if (error) throw error;

    const optionsToAdd = new Set<string>();

    // Extract all unique specification values by category
    for (const product of products) {
      const specs = (product.specifications as Record<string, any>) || {};
      
      for (const [category, value] of Object.entries(specs)) {
        if (typeof value === 'string' && value.trim() && 
            ['Media', 'Type', 'Style', 'Color'].includes(category)) {
          
          // Handle color tags (comma-separated)
          if (category === 'Color' && value.includes(',')) {
            const colors = value.split(',').map(c => c.trim());
            colors.forEach(color => {
              if (color) optionsToAdd.add(`${category}:${color}`);
            });
          } else if (value.trim()) {
            optionsToAdd.add(`${category}:${value.trim()}`);
          }
        }
      }
    }

    // Add options to database
    let addedCount = 0;
    for (const option of optionsToAdd) {
      const [category, value] = option.split(':');
      
      try {
        const { error } = await supabase
          .from('specification_options')
          .insert({
            category,
            option_value: value,
            usage_count: 1
          });

        if (!error) {
          addedCount++;
        }
      } catch (insertError) {
        // Ignore duplicate key errors
        if (!insertError.message?.includes('duplicate key')) {
          console.error('Failed to add option:', insertError);
        }
      }
    }

    console.log(`Added ${addedCount} new specification options`);
    return { success: true, addedCount };
    
  } catch (error) {
    console.error('Failed to populate specification options:', error);
    return { success: false, error };
  }
};

// Run both migrations
export const runFullMigration = async () => {
  console.log('Starting full specification system migration...');
  
  const migrationResult = await migrateExistingSpecifications();
  const populationResult = await populateSpecificationOptions();
  
  return {
    migration: migrationResult,
    population: populationResult
  };
};