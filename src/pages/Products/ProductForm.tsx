import { useRef, useState } from 'react';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ProductFormValues } from '@/types/product';
import { normalizeNumberString } from '@/utils/NumberString';

interface ProductFormProps {
  value: ProductFormValues;
  onChange: (next: ProductFormValues) => void;
  onSubmit: () => Promise<void>;
  submitLabel: string;
  disabled?: boolean;
  showIsVisible?: boolean;
}

function ProductForm({
  value,
  onChange,
  onSubmit,
  submitLabel,
  disabled,
  showIsVisible,
}: ProductFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);

  //errors
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});
  const validate = () => {
    const nextErrors: typeof errors = {};

    if (!value.name) nextErrors.name = '商品名を入力してください';

    if (!value.price) {
      nextErrors.price = '価格を入力してください';
    } else {
      const row = normalizeNumberString(value.price).trim();

      if (!row) nextErrors.price = '価格を入力してください';
      else {
        const n = Number(row);

        if (Number.isNaN(n)) {
          nextErrors.price = '価格は数字で入力してください';
        } else if (n < 1) nextErrors.price = '価格は１以上にしてください';
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const updateValue = (updates: Partial<ProductFormValues>) => {
    onChange({ ...value, ...updates });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
      }
      setPreviewUrl(null);
      onChange({ ...value, imageFile: null });

      return;
    }

    const file = files[0];

    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }
    const url = URL.createObjectURL(file);
    previewRef.current = url;

    setPreviewUrl(url);
    updateValue({ imageFile: file });
  };

  const cleanupPreviewUrl = () => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    setPreviewUrl(null);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!validate()) return;

          void onSubmit().then(() => {
            cleanupPreviewUrl();
          });
        }}
      >
        <div className="relative m-auto">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className="h-44 rounded bg-gray-100 object-contain"
            />
          ) : value.image ? (
            <img
              src={`http://localhost/storage/${value.image}`}
              alt={value.name}
              className="h-44 rounded bg-gray-100 object-contain"
            />
          ) : (
            <div className="flex h-44 w-44 items-center justify-center rounded bg-gray-100">
              Not Image
            </div>
          )}
        </div>
        <Label htmlFor="name" className="py-2">
          画像
        </Label>
        <Input name="image" type="file" onChange={handleImageChange} />

        <Label htmlFor="name" className="py-2">
          商品名
        </Label>
        <Input
          name="name"
          value={value.name}
          onChange={(e) => {
            updateValue({ name: e.target.value });
            setErrors((prev) => ({ ...prev, name: undefined }));
          }}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

        <Label htmlFor="price" className="py-2">
          価格
        </Label>
        <Input
          name="price"
          value={value.price}
          onChange={(e) => {
            updateValue({ price: e.target.value });
            setErrors((prev) => ({ ...prev, price: undefined }));
          }}
        />
        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}

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
            SOLD OUTとして登録する
          </Label>
        </div>

        {/* isVisible   */}
        {showIsVisible && (
          <div className="flex items-center gap-3">
            <Checkbox
              id="isVisible"
              checked={!value.isVisible}
              onCheckedChange={(checked: CheckedState) => {
                const isStopped = checked === true;
                updateValue({ isVisible: !isStopped });
              }}
            />
            <Label htmlFor="isVisible" className="py-2">
              非表示にする
            </Label>
          </div>
        )}

        <Button type="submit" disabled={disabled}>
          {submitLabel}
        </Button>
      </form>
    </>
  );
}

export default ProductForm;
