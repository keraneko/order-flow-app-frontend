import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
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
