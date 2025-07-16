import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { format, addHours, addDays, isValid } from 'date-fns';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ProductTimedEditionTabProps {
  formData: any;
  onChange: (data: any) => void;
}

const ProductTimedEditionTab: React.FC<ProductTimedEditionTabProps> = ({
  formData,
  onChange
}) => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    formData.start_time ? new Date(formData.start_time) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    formData.end_time ? new Date(formData.end_time) : undefined
  );
  const [duration, setDuration] = useState({ hours: 24, minutes: 0 });
  const { toast } = useToast();

  const isTimedEdition = Boolean(formData.end_time);

  const handleTimedEditionToggle = (enabled: boolean) => {
    if (enabled) {
      // Enable timed edition - set default values
      const now = new Date();
      const defaultStart = addHours(now, 1); // Start in 1 hour
      const defaultEnd = addDays(defaultStart, 1); // End in 24 hours
      
      setStartDate(defaultStart);
      setEndDate(defaultEnd);
      onChange({
        ...formData,
        start_time: defaultStart.toISOString(),
        end_time: defaultEnd.toISOString(),
        is_limited_edition: true
      });
    } else {
      // Disable timed edition
      setStartDate(undefined);
      setEndDate(undefined);
      onChange({
        ...formData,
        start_time: null,
        end_time: null
      });
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    setStartDate(date);
    
    // Auto-calculate end date if duration is set
    if (duration.hours > 0 || duration.minutes > 0) {
      const totalMinutes = duration.hours * 60 + duration.minutes;
      const calculatedEndDate = new Date(date.getTime() + totalMinutes * 60000);
      setEndDate(calculatedEndDate);
      onChange({
        ...formData,
        start_time: date.toISOString(),
        end_time: calculatedEndDate.toISOString()
      });
    } else {
      onChange({
        ...formData,
        start_time: date.toISOString()
      });
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    setEndDate(date);
    onChange({
      ...formData,
      end_time: date.toISOString()
    });
  };

  const handleDurationChange = (field: 'hours' | 'minutes', value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    
    if (field === 'hours' && numValue > 168) { // Max 1 week
      toast({
        title: "Duration Limit",
        description: "Maximum duration is 168 hours (1 week)",
        variant: "destructive"
      });
      return;
    }
    
    if (field === 'minutes' && numValue > 59) {
      return;
    }

    const newDuration = { ...duration, [field]: numValue };
    setDuration(newDuration);

    // Auto-calculate end date if start date is set
    if (startDate) {
      const totalMinutes = newDuration.hours * 60 + newDuration.minutes;
      const calculatedEndDate = new Date(startDate.getTime() + totalMinutes * 60000);
      setEndDate(calculatedEndDate);
      onChange({
        ...formData,
        end_time: calculatedEndDate.toISOString()
      });
    }
  };

  const getTimeRemaining = () => {
    if (!endDate) return null;
    
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Expired";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const isActive = () => {
    if (!startDate || !endDate) return false;
    const now = new Date();
    return now >= startDate && now <= endDate;
  };

  const getStatusColor = () => {
    if (!endDate) return "text-muted-foreground";
    
    const now = new Date();
    if (startDate && now < startDate) return "text-blue-500"; // Scheduled
    if (now <= endDate) return "text-green-500"; // Active
    return "text-red-500"; // Expired
  };

  const getStatusText = () => {
    if (!startDate || !endDate) return "Not configured";
    
    const now = new Date();
    if (now < startDate) return "Scheduled";
    if (now <= endDate) return "Active";
    return "Expired";
  };

  return (
    <div className="space-y-6">
      {/* Toggle Timed Edition */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-1">
          <Label className="text-lg font-medium">Timed Edition</Label>
          <p className="text-sm text-muted-foreground">
            Enable countdown timer and automatic expiration
          </p>
        </div>
        <Switch
          checked={isTimedEdition}
          onCheckedChange={handleTimedEditionToggle}
        />
      </div>

      {isTimedEdition && (
        <>
          {/* Status Display */}
          <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <div className={`font-medium ${getStatusColor()}`}>
                Status: {getStatusText()}
              </div>
              {endDate && (
                <div className="text-sm text-muted-foreground">
                  Time remaining: {getTimeRemaining()}
                </div>
              )}
            </div>
          </div>

          {/* Duration Quick Set */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Duration (Hours & Minutes)</Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="hours" className="text-sm">Hours:</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  max="168"
                  value={duration.hours}
                  onChange={(e) => handleDurationChange('hours', e.target.value)}
                  className="w-20"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="minutes" className="text-sm">Minutes:</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={duration.minutes}
                  onChange={(e) => handleDurationChange('minutes', e.target.value)}
                  className="w-20"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setDuration({ hours: 1, minutes: 0 });
                    if (startDate) handleDurationChange('hours', '1');
                  }}
                >
                  1H
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setDuration({ hours: 24, minutes: 0 });
                    if (startDate) handleDurationChange('hours', '24');
                  }}
                >
                  24H
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setDuration({ hours: 72, minutes: 0 });
                    if (startDate) handleDurationChange('hours', '72');
                  }}
                >
                  72H
                </Button>
              </div>
            </div>
          </div>

          {/* Start Date/Time */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Start Date & Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP 'at' p") : "Select start date & time"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date/Time */}
          <div className="space-y-4">
            <Label className="text-base font-medium">End Date & Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP 'at' p") : "Select end date & time"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateChange}
                  disabled={(date) => {
                    const minDate = startDate || new Date();
                    return date < minDate;
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Warning */}
          {startDate && endDate && (
            <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Important:</p>
                <p>When the timer expires, the "Add to Cart" button will be disabled and show "SOLD OUT". Make sure your timing is correct.</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductTimedEditionTab;