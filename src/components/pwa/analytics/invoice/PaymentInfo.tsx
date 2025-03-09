
import React from "react";
import { Input } from "@/components/ui/input";

interface PaymentInfoProps {
  artistName: string;
  bankName: string;
  setBankName: (value: string) => void;
  bsb: string;
  setBsb: (value: string) => void;
  accountNumber: string;
  setAccountNumber: (value: string) => void;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({
  artistName,
  bankName,
  setBankName,
  bsb,
  setBsb,
  accountNumber,
  setAccountNumber,
}) => {
  return (
    <div className="border rounded-md p-4 bg-muted/20 mt-8">
      <p className="font-bold mb-2">Pay to:</p>
      <p>{artistName}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        <div className="flex flex-col">
          <label htmlFor="bankName" className="text-sm text-muted-foreground">Bank Name:</label>
          <Input 
            id="bankName"
            value={bankName} 
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Enter bank name"
            className="mt-1"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="bsb" className="text-sm text-muted-foreground">BSB:</label>
          <Input 
            id="bsb"
            value={bsb} 
            onChange={(e) => setBsb(e.target.value)}
            placeholder="Enter BSB"
            className="mt-1"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="accountNumber" className="text-sm text-muted-foreground">Account Number:</label>
          <Input 
            id="accountNumber"
            value={accountNumber} 
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter account number"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
