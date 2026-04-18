import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'sonner';
import ProductForm from '@/components/product/ProductForm';
import { apiClient } from '@/lib/axios';
import type { ProductFormValues } from '@/types/product';
import { getFirstAxiosValidationMessage } from '@/utils/apiError';
import { normalizeNumberString } from '@/utils/NumberString';

const createProductInput: ProductFormValues = {
  name: '',
  price: '',
  image: null,
  imageFile: null,
  isActive: true,
  isVisible: true,
};

function CreateProductPage() {
  const navigate = useNavigate();
  const [productInput, setProductInput] =
    useState<ProductFormValues>(createProductInput);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const raw = normalizeNumberString(productInput.price).trim();
      const num = Number(raw);

      //Form Data
      const formData = new FormData();
      formData.append('name', productInput.name);
      formData.append('price', String(num));
      formData.append('is_active', productInput.isActive ? '1' : '0');
      formData.append('is_visible', productInput.isVisible ? '1' : '0');

      if (productInput.imageFile) {
        formData.append('image', productInput.imageFile);
      }

      await apiClient.post('/api/products', formData);

      toast.success('登録しました');
      void navigate('/products');
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;

        if (status === 422) {
          // const data = e.response?.data as {
          //   errors?: Record<string, string[]>;
          // };

          // const firstMessage =
          //  = data.errors
          //   ? Object.values(data.errors)[0]?.[0]
          //   : undefined;

          toast.error(
            getFirstAxiosValidationMessage(e.response?.data) ??
              '入力内容が間違っています',
          );

          return;
        }
        toast.error('登録に失敗しました');

        return;
      }

      toast.error('登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1>商品登録</h1>
      <ProductForm
        value={productInput}
        onChange={setProductInput}
        onSubmit={handleSubmit}
        submitLabel="登録する"
        isSubmitting={isSubmitting}
      />
    </>
  );
}

export default CreateProductPage;
