import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { toast } from 'sonner';
import StoreForm from '@/components/store/StoreForm';
import { apiClient } from '@/lib/axios';
import type { StoreFormValue } from '@/types/store';
import {
  getAxiosMessage,
  getFirstAxiosValidationMessage,
} from '@/utils/apiError';

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
        const validationMessage = getFirstAxiosValidationMessage(
          e.response?.data,
        );
        const apiMessage = getAxiosMessage(e.response?.data);

        if (status === 403) {
          toast.error('現在のユーザーでは登録する権限がありません');

          return;
        }

        if (status === 422) {
          toast.error(
            validationMessage ?? apiMessage ?? '入力内容が間違っています',
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
    <div className="flex flex-col gap-6">
      <button
        className="flex w-fit items-center gap-1 text-sm text-gray-400 transition-colors hover:text-amber-700"
        onClick={() => void navigate('/stores')}
      >
        ← 店舗一覧に戻る
      </button>

      <h2 className="border-b pb-3 text-xl font-bold">店舗登録</h2>

      <div className="max-w-lg">
        <StoreForm
          value={storeInput}
          onChange={setStoreInput}
          onSubmit={handleSubmit}
          submitLabel="登録する"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default CreateStorePage;
