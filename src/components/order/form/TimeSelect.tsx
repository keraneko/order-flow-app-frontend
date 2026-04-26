import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const buildTimeOptions = (): string[] => {
  const startMinutes = 8 * 60; //営業開始時間
  const endMinutes = 20 * 60; //営業終了時間
  const options: string[] = [];

  for (let t = startMinutes; t <= endMinutes; t += 10) {
    const hh = Math.floor(t / 60);
    const mm = t % 60;

    const label = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    options.push(label);
  }

  return options;
};
interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

export function TimeSelect({
  value,
  onChange,
  label,
  disabled,
}: TimeSelectProps) {
  const timeOptions = buildTimeOptions();

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="選択して下さい" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}{' '}
          {timeOptions.map((time) => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
