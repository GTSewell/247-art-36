import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { UrlInputFieldsProps } from "./types";
import { getUrlIcon } from "./utils";

const UrlInputFields: React.FC<UrlInputFieldsProps> = ({ urls, onUrlsChange }) => {
  const addUrlField = () => {
    onUrlsChange([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    if (urls.length > 1) {
      onUrlsChange(urls.filter((_, i) => i !== index));
    }
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    onUrlsChange(newUrls);
  };

  return (
    <div className="space-y-3">
      <Label>Your Links</Label>
      {urls.map((url, index) => {
        const IconComponent = getUrlIcon(url);
        return (
          <div key={index} className="flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {url && <IconComponent className="h-4 w-4" />}
              </div>
              <Input
                value={url}
                onChange={(e) => updateUrl(index, e.target.value)}
                placeholder="https://instagram.com/yourprofile or https://yourwebsite.com"
                className="pl-10"
              />
            </div>
            {urls.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeUrlField(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      })}
      
      <Button
        type="button"
        variant="outline"
        onClick={addUrlField}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Link
      </Button>
    </div>
  );
};

export default UrlInputFields;