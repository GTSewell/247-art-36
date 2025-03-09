
import React from "react";
import InvoiceHeader from "./InvoiceHeader";
import BillingInfo from "./BillingInfo";
import LineItems from "./LineItems";
import InvoiceTotal from "./InvoiceTotal";
import PaymentInfo from "./PaymentInfo";
import ThankYouSection from "./ThankYouSection";

interface InvoiceDocumentProps {
  invoiceNumber: string;
  formattedDate: string;
  invoiceData: {
    artistName: string;
    lineItems: Array<{
      quantity: number;
      title: string;
      type: string;
      unitPrice: number;
    }>;
    totalAmount: number;
  };
  bankName: string;
  setBankName: (value: string) => void;
  bsb: string;
  setBsb: (value: string) => void;
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  zoomLevel: number;
}

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({
  invoiceNumber,
  formattedDate,
  invoiceData,
  bankName,
  setBankName,
  bsb,
  setBsb,
  accountNumber,
  setAccountNumber,
  zoomLevel,
}) => {
  return (
    <div 
      className="bg-white mx-auto shadow-lg relative"
      style={{ 
        width: '100%',
        maxWidth: '800px',
        aspectRatio: '1/1.414',
        transform: `scale(${zoomLevel})`, 
        transformOrigin: 'top center',
        marginBottom: zoomLevel > 1 ? `${(zoomLevel - 1) * 100}%` : '0',
        transition: 'transform 0.2s ease',
        padding: '2rem',
      }}
    >
      <InvoiceHeader 
        invoiceNumber={invoiceNumber}
        formattedDate={formattedDate}
        artistName={invoiceData.artistName}
      />
      
      <BillingInfo artistName={invoiceData.artistName} />
      
      <LineItems lineItems={invoiceData.lineItems} />
      
      <InvoiceTotal totalAmount={invoiceData.totalAmount} />
      
      <PaymentInfo 
        artistName={invoiceData.artistName}
        bankName={bankName}
        setBankName={setBankName}
        bsb={bsb}
        setBsb={setBsb}
        accountNumber={accountNumber}
        setAccountNumber={setAccountNumber}
      />
      
      <ThankYouSection />
    </div>
  );
};

export default InvoiceDocument;
