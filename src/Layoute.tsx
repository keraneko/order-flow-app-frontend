import { Link, NavLink, Outlet } from 'react-router-dom';
import { ListChevronsUpDown, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';

const Layout = () => {
  return (
    <>
      <header>
        <div className="flex h-16 items-center justify-between">
          <div>
            <Link to="/">
              <h2 className="w-20 bg-red-400 text-center font-bold text-white">
                OrderFlow-App
              </h2>
            </Link>
          </div>
          <div className="flex">
            <Link to="/cartlist">
              <ShoppingCart />
            </Link>
            <ListChevronsUpDown className="ml-2" />
          </div>
        </div>
      </header>
      <nav className="flex list-none gap-4 p-4">
        <li>
          <NavLink to="/">
            <Button variant="secondary">Home</Button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/carts">
            <Button variant="secondary">Carts</Button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/cartlist">
            <Button variant="secondary">Cartlist</Button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/customers">
            <Button variant="secondary">Customers</Button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/confirm">
            <Button variant="secondary">confirm</Button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/products">
            <Button variant="secondary">ProductIndex</Button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/stores">
            <Button variant="secondary">storeIndex</Button>
          </NavLink>
        </li>
      </nav>
      <Outlet />
      <footer className="mt-20 w-full border-t-2">
        <p>フッター</p>
      </footer>
      {/* <footer className= ' p-0 bg-gray-200 fixed bottom-0 w-full border-t-2 mt-8 flex justify-between h-30 items-center'>
        <div className='m-auto '>
            <p>注文内容</p>
        </div>
        <div className='text-center m-auto'>
            <p className=''>合計金額</p>
            <h2 className='text-red-600 font-bold'>{totalPrice}円</h2>
        </div>
        <Button className='font-bold text-xl p-8 m-auto'>注文確認画面へ</Button> 
        
    </footer> */}
    </>
  );
};

export default Layout;
