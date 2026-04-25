import axios from 'axios';
import { apiClient } from '@/lib/axios';

interface CurrentUserApi {
  id: number;
  name: string;
  login_id: string;
  role: 'admin' | 'store_user';
  store_id: number | null;
}

interface CurrentUser {
  id: number;
  name: string;
  loginId: string;
  role: 'admin' | 'store_user';
  storeId: number | null;
}

const toCurrentUser = (user: CurrentUserApi): CurrentUser => ({
  id: user.id,
  name: user.name,
  loginId: user.login_id,
  role: user.role,
  storeId: user.store_id,
});

interface LoginPayload {
  login_id: string;
  password: string;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  try {
    const res = await apiClient.get<CurrentUserApi>('/api/user');

    return toCurrentUser(res.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`HTTP ${error.response?.status ?? 'unknown'}`);
    }
    throw new Error('ユーザー取得に失敗しました');
  }
}

export async function getCsrfCookie() {
  await apiClient.get('/sanctum/csrf-cookie');
}

export async function postLogin(payload: LoginPayload) {
  try {
    await getCsrfCookie();
    await apiClient.post('/login', payload);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401) {
        throw new Error('認証情報が正しくありません');
      }

      if (status === 422) {
        throw new Error('入力内容を確認してください');
      }

      if (status === 419) {
        throw new Error('セッションが切れました');
      }
    }
    throw new Error('ログインに失敗しました');
  }
}

export async function logout() {
  try {
    await apiClient.post('/logout', {});
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`HTTP ${error.response?.status ?? 'unknown'}`);
    }
    throw new Error('ログアウトに失敗しました');
  }
}
