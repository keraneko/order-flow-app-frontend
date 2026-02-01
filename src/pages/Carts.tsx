import CartList from'@/pages/CartList'
import Home from '@/pages/Home'

function Carts() {
  

  return (
    <>
    <div className='flex justify-between'>
      <div className='w-2/3'>
        <Home />  
      </div>
      <div className='w-1/3'>
        <CartList />
      </div>
    </div>
</>)

}

export default Carts;
