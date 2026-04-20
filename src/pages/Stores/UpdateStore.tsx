import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { toast } from 'sonner';
import type { StoreApi } from '@/api/stores';
import StoreForm from '@/components/store/StoreForm';
import { apiClient } from '@/lib/axios';
import NotFound from '@/pages/NotFound';
import type { StoreFormValue } from '@/types/store';
import { getFirstAxiosValidationMessage } from '@/utils/apiError';

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

      await apiClient.patch(`/api/stores/${storeId}`, payload);

      toast.success('登録しました');
      void navigate('/stores');
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;

        if (status === 422) {
          toast.error(
            getFirstAxiosValidationMessage(e.response?.data) ??
              '入力内容が間違っています',
          );
        }
      }
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
        isSubmitting={isSubmitting}
      />
    </>
  );
}

export default UpdateStorePage;
