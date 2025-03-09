
import React from "react";

interface BillingInfoProps {
  artistName: string;
}

const BillingInfo: React.FC<BillingInfoProps> = ({ artistName }) => {
  return (
    <div className="grid grid-cols-2 gap-6 mt-8">
      <div>
        <p className="font-bold mb-2">BILL TO:</p>
        <p>247art Pty Ltd</p>
        <p>123 Art Way</p>
        <p>Sydney, NSW 2000</p>
        <p>admin@247art.com</p>
      </div>
      
      <div>
        <p className="font-bold mb-2">BILL FROM:</p>
        <p>{artistName}</p>
        <p>Artist Address</p>
        <p>artist@example.com</p>
      </div>
    </div>
  );
};

export default BillingInfo;
