import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'sonner';
import StoreForm from '@/components/store/StoreForm';
import { apiClient } from '@/lib/axios';
import type { StoreFormValue } from '@/types/store';
import { getFirstAxiosValidationMessage } from '@/utils/apiError';

const createStoreInput: StoreFormValue = {
  code: '',
  name: '',
  postalCode: '',
  prefecture: '',
  city: '',
  addressLine: '',
  isActive: true,
};

function CreateStorePage() {
  const navigate = useNavigate();
  const [storeInput, setStoreInput] =
    useState<StoreFormValue>(createStoreInput);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      await apiClient.post('/api/stores', payload);

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
      <h2>店舗登録</h2>
      <StoreForm
        value={storeInput}
        onChange={setStoreInput}
        onSubmit={handleSubmit}
        submitLabel="登録する"
        isSubmitting={isSubmitting}
      />
    </>
  );
}

export default CreateStorePage;
