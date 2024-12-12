import { Minus, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface FontSizeInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const FontSizeInput = ({ value, onChange }: FontSizeInputProps) => {
  const increment = () => onChange(value + 1);
  const decrement = () => onChange(Math.max(0,value - 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const inputValue=e.target.value;

    if(inputValue===''){
        onChange(0);
        return;
    }
    
    const parsedValue=parseInt(inputValue,10);

    if(!isNaN(parsedValue)){
        onChange(parsedValue);
    }

  };
  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        className="p-2 rounded-l-none border-r-0"
        size="icon"
        onClick={decrement}
      >
        <Minus className="size-4" />
      </Button>
      <Input
        className="w-[50px] h-8 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none"
        onChange={handleChange}
        value={value}
      />
      <Button
        variant="outline"
        className="p-2 rounded-l-none border-r-0"
        size="icon"
        onClick={increment}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
};
