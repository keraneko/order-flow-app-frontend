import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import NotFound from '@/pages/NotFound';
import type { StoreApi, StoreFormValue } from '@/types/Stores';
import { getFirstValidationMessage } from '@/Utils/LaravelValidationError';

import StoreForm from './StoreForm';

const updateStoreInput: StoreFormValue = {
  code: '',
  name: '',
  postalCode: '',
  prefecture: '',
  city: '',
  addressLine: '',
  isActive: true,
};

function UpdateStorePage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [storeInput, setStoreInput] =
    useState<StoreFormValue>(updateStoreInput);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!storeId) return;

    setError(null);
    setLoading(true);
    setNotFound(false);

    void (async () => {
      try {
        const res = await fetch(`/api/stores/${storeId}`);

        if (res.status === 404) {
          setNotFound(true);

          return;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = (await res.json()) as StoreApi;
        const mapped = {
          code: data.code,
          name: data.name,
          postalCode: data.postal_code,
          prefecture: data.prefecture,
          city: data.city,
          addressLine: data.address_line,
          isActive: Boolean(data.is_active),
        };
        setStoreInput(mapped);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, [storeId]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  if (notFound) return <NotFound />;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        code: storeInput.code,
        name: storeInput.name,
        postal_code: storeInput.postalCode,
        prefecture: storeInput.prefecture,
        city: storeInput.city,
        address_line: storeInput.addressLine,
        is_active: storeInput.isActive,
      };

      const res = await fetch(`/api/stores/${storeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 422) {
          toast.error(getFirstValidationMessage(res));

          return;
        }
        toast.error('登録に失敗しました');

        return;
      }

      toast.success('登録しました');
      void navigate('/stores');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1>店舗編集</h1>
      <StoreForm
        value={storeInput}
        onChange={setStoreInput}
        onSubmit={handleSubmit}
        submitLabel="編集を登録する"
        disabled={isSubmitting}
      />
    </>
  );
}

export default UpdateStorePage;
