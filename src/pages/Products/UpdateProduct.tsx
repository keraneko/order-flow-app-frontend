import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import type { ProductApi } from '@/api/products';
import NotFound from '@/pages/NotFound';
import type { ProductFormValues } from '@/types/Product';
import { getFirstValidationMessage } from '@/utils/LaravelValidationError';
import { normalizeNumberString } from '@/utils/NumberString';

import ProductForm from './ProductForm';

const updateProductInput: ProductFormValues = {
  name: '',
  price: '',
  image: '',
  imageFile: null,
  isActive: true,
  isVisible: true,
};

function UpdateProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productInput, setProductInput] =
    useState<ProductFormValues>(updateProductInput);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);
    setNotFound(false);

    void (async () => {
      try {
        const res = await fetch(`/api/products/${id}`);

        if (res.status === 404) {
          setNotFound(true);

          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = (await res.json()) as ProductApi;
        const mapped = {
          name: data.name,
          price: String(data.price),
          image: data.image_path,
          imageFile: null,
          isActive: Boolean(data.is_active),
          isVisible: Boolean(data.is_visible),
        };
        setProductInput(mapped);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (notFound) return <NotFound />;

  const handleSubmit = async () => {
    if (!id) return;

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const raw = normalizeNumberString(productInput.price).trim();
      const num = Number(raw);

      const formData = new FormData();
      formData.append('_method', 'PATCH');
      formData.append('name', productInput.name);
      formData.append('price', String(num));
      formData.append('is_active', productInput.isActive ? '1' : '0');
      formData.append('is_visible', productInput.isVisible ? '1' : '0');

      if (productInput.imageFile) {
        formData.append('image', productInput.imageFile);
      }

      const res = await fetch(`/api/products/${id}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 422) {
          toast.error(await getFirstValidationMessage(res));

          return;
        }
        toast.error('更新に失敗しました');

        return;
      }

      toast.success('更新しました');
      void navigate('/products');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1>商品編集</h1>
      <ProductForm
        value={productInput}
        onChange={setProductInput}
        onSubmit={handleSubmit}
        submitLabel="編集を登録する"
        disabled={isSubmitting}
        showIsVisible={true}
      />
    </>
  );
}

export default UpdateProductPage;
