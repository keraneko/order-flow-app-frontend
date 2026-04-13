import axios from 'axios';
import { apiClient } from '@/lib/axios';

interface CurrentUser {
  id: number;
  name: string;
  login_id: string;
}

interface LoginPayload {
  login_id: string;
  password: string;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  try {
    const res = await apiClient.get<CurrentUser>('/api/user');

    return res.data;
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
