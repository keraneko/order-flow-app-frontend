import type { CheckedState } from '@radix-ui/react-checkbox';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StoreFormValue } from '@/types/store';

interface StoreFormProps {
  value: StoreFormValue;
  onChange: (next: StoreFormValue) => void;
  onSubmit: () => Promise<void>;
  submitLabel: string;
  isSubmitting?: boolean;
}

function StoreForm({
  value,
  onChange,
  onSubmit,
  submitLabel,
  isSubmitting,
}: StoreFormProps) {
  const updateValue = (updates: Partial<StoreFormValue>) => {
    onChange({ ...value, ...updates });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    void onSubmit();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="code" className="py-2">
          店舗コード
        </Label>
        <Input
          id="code"
          name="code"
          value={value.code}
          onChange={(e) => {
            updateValue({ code: e.target.value });
          }}
        />

        <Label htmlFor="name" className="py-2">
          店舗名
        </Label>
        <Input
          id="name"
          name="name"
          value={value.name}
          onChange={(e) => {
            updateValue({ name: e.target.value });
          }}
        />

        <Label htmlFor="postalCode" className="py-2">
          郵便番号
        </Label>
        <Input
          id="postalCode"
          name="postalCode"
          value={value.postalCode}
          onChange={(e) => {
            updateValue({ postalCode: e.target.value });
          }}
        />

        <Label htmlFor="prefecture" className="py-2">
          都道府県
        </Label>
        <Input
          id="prefecture"
          name="prefecture"
          value={value.prefecture}
          onChange={(e) => {
            updateValue({ prefecture: e.target.value });
          }}
        />

        <Label htmlFor="city" className="py-2">
          市町村
        </Label>
        <Input
          id="city"
          name="city"
          value={value.city}
          onChange={(e) => {
            updateValue({ city: e.target.value });
          }}
        />

        <Label htmlFor="addressLine" className="py-2">
          番地以降
        </Label>
        <Input
          id="addressLine"
          name="addressLine"
          value={value.addressLine}
          onChange={(e) => {
            updateValue({ addressLine: e.target.value });
          }}
        />

        {/* isActive */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="isActive"
            checked={!value.isActive}
            onCheckedChange={(checked: CheckedState) => {
              const isStopped = checked === true;
              updateValue({ isActive: !isStopped });
            }}
          />
          <Label htmlFor="isActive" className="py-2">
            店舗を非公開にする
          </Label>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </form>
    </>
  );
}

export default StoreForm;
