
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageFilter as MessageFilterType } from './types';

interface MessageFilterProps {
  value: MessageFilterType;
  onChange: (value: MessageFilterType) => void;
}

const MessageFilter = ({ value, onChange }: MessageFilterProps) => {
  return (
    <div className="mb-4">
      <Select 
        value={value} 
        onValueChange={(val) => onChange(val as MessageFilterType)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter messages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Messages</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="replied">Replied</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MessageFilter;
