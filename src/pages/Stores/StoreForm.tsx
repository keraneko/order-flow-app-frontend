import { useState } from 'react';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { StoreFormValue } from '@/types/store';
import { normalizeNumberString } from '@/utils/NumberString';

interface StoreFormProps {
  value: StoreFormValue;
  onChange: (next: StoreFormValue) => void;
  onSubmit: () => Promise<void>;
  submitLabel: string;
  disabled?: boolean;
}

function StoreForm({
  value,
  onChange,
  onSubmit,
  submitLabel,
  disabled,
}: StoreFormProps) {
  //errors
  const [errors, setErrors] = useState<{
    code?: string;
    name?: string;
    postalCode?: string;
    prefecture?: string;
    city?: string;
    addressLine?: string;
  }>({});
  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!value.code) {
      nextErrors.code = '店舗コードは必須です';
    } else {
      const row = normalizeNumberString(value.code).trim();

      if (!row) {
        nextErrors.code = '店舗コードは必須です';
      } else if (!/^\d{6}$/.test(row)) {
        nextErrors.code = '店舗コードは6桁の数字で入力してください';
      }
    }

    if (!value.name) nextErrors.name = '店舗名は必須です';

    if (!value.postalCode) nextErrors.postalCode = '郵便番号は必須です';

    if (!value.prefecture) nextErrors.prefecture = '都道府県は必須です';

    if (!value.city) nextErrors.city = '市町村は必須です';

    if (!value.addressLine) nextErrors.addressLine = '番地以下は必須です';

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const updateValue = (updates: Partial<StoreFormValue>) => {
    onChange({ ...value, ...updates });
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!validate()) return;
          void onSubmit();
        }}
      >
        <Label htmlFor="code" className="py-2">
          店舗コード
        </Label>
        <Input
          name="code"
          value={value.code}
          onChange={(e) => {
            updateValue({ code: e.target.value });
            setErrors((prev) => ({ ...prev, code: undefined }));
          }}
        />
        {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}

        <Label htmlFor="name" className="py-2">
          店舗名
        </Label>
        <Input
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
            公開しない
          </Label>
        </div>

        <Button type="submit" disabled={disabled}>
          {submitLabel}
        </Button>
      </form>
    </>
  );
}

export default StoreForm;
