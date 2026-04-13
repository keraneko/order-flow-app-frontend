import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function Home() {
  const navigate = useNavigate();
  //仮置き
  const { data, isPending, isError, error } = useCurrentUser();

  if (isPending) return <span>データ取得中</span>;

  if (isError) return <span>{error.message}</span>;

  if (!data) return <span>Loading...</span>;

  return (
    <>
      {data.name}
      <div className="my-10 text-center">
        <h2>Order-Frow app</h2>
        <Button
          variant="outline"
          onClick={() => void navigate('/order/options')}
        >
          注文を開始する
        </Button>
      </div>
    </>
  );
}
