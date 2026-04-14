import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { postLogin } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Login {
  loginId: string;
  password: string;
}

const defaultLogin: Login = {
  loginId: '',
  password: '',
};

export default function Login() {
  const navigate = useNavigate();
  const [loginInput, setLoginInput] = useState<Login>(defaultLogin);

  const handleLogin = async () => {
    try {
      const payload = {
        login_id: loginInput.loginId,
        password: loginInput.password,
      };

      await postLogin(payload);
      setLoginInput(defaultLogin);
      void navigate('/orders');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'ログインに失敗しました';
      toast.error(message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        {/* ロゴ・タイトルエリア */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Order Flow</h1>
        </div>

        {/* フォームカード */}
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white px-8 py-10 shadow-sm">
          <div className="space-y-1.5">
            <Label htmlFor="loginId">ログインID</Label>
            <Input
              id="loginId"
              type="text"
              name="loginId"
              placeholder="ログインIDを入力"
              value={loginInput.loginId}
              onChange={handleChange}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="パスワードを入力"
              value={loginInput.password}
              onChange={handleChange}
              className="rounded-xl"
            />
          </div>

          <Button
            type="button"
            className="mt-2 w-full rounded-xl bg-amber-700 hover:bg-amber-800"
            onClick={(e) => {
              e.preventDefault();
              void handleLogin();
            }}
          >
            ログインする
          </Button>
        </div>
      </div>
    </div>
  );
}
