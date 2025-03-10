
import { Collector } from "./types";

export const useCollectorExport = (collectors: Collector[]) => {
  // Function to download collector data as CSV
  const handleDownload = () => {
    // Headers for CSV
    const headers = ["Name", "Items Purchased", "Collector Name", "Social", "Email"];
    
    // Map collector data to CSV rows
    const rows = collectors.map(collector => {
      const itemsList = collector.itemsPurchased.join("; ");
      const socialList = Object.keys(collector.social).join("; ");
      return [
        collector.name,
        itemsList,
        collector.collectorName || "Not available",
        socialList || "Not available",
        collector.email || "Not available"
      ];
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "my_collectors.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { handleDownload };
};
