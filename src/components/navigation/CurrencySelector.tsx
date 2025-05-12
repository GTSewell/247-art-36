
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DollarSign, ChevronsUpDown } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Define supported currencies
const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', icon: <DollarSign className="h-4 w-4" /> },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', icon: <DollarSign className="h-4 w-4" /> },
  { code: 'GBP', symbol: '£', name: 'British Pound', icon: <DollarSign className="h-4 w-4" /> },
  { code: 'EUR', symbol: '€', name: 'Euro', icon: <DollarSign className="h-4 w-4" /> },
  { code: 'ETH', symbol: 'Ξ', name: 'Ethereum', icon: <DollarSign className="h-4 w-4" /> },
  { code: 'BTC', symbol: '₿', name: 'Bitcoin', icon: <DollarSign className="h-4 w-4" /> },
];

interface CurrencySelectorProps {
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ className }) => {
  const [selectedCurrency, setSelectedCurrency] = useLocalStorage('preferredCurrency', 'USD');
  
  const currentCurrency = currencies.find(c => c.code === selectedCurrency) || currencies[0];

  const handleSelectCurrency = (code: string) => {
    setSelectedCurrency(code);
    // You could dispatch an event or use a context to inform the app of the currency change
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`flex justify-between items-center w-full ${className}`}>
          <div className="flex items-center">
            {currentCurrency.icon}
            <span className="ml-2">{currentCurrency.symbol} {currentCurrency.code}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Select Currency</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {currencies.map(currency => (
          <DropdownMenuItem
            key={currency.code}
            className={`flex items-center gap-2 ${currency.code === selectedCurrency ? 'bg-accent' : ''}`}
            onClick={() => handleSelectCurrency(currency.code)}
          >
            {currency.icon}
            <span>{currency.symbol} {currency.code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;
