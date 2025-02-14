
import Navigation from "@/components/Navigation";

const GeneralStore = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold mb-6">247.art General Store</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for store items */}
          <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
            <p className="text-gray-600">Our general store is under construction. Check back soon for exclusive 247.art merchandise and collectibles.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralStore;
