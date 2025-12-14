// import {useState} from 'react'

// function Carts() {

//   const Parent = () => {
//   const [text, setText] = useState("");

//   const handleTextChange = (value: string) => {
//     setText(value);   // ← 子から受け取った値で state 更新
//   };

//   return (
//     <div>
//       <Child onInputChange={handleTextChange} />
//       <p>親が受け取った値：{text}</p>
//     </div>
//   );
// };

// const Child = ({onInputChange}) => { //親が呼び出した関数を使っている
//   const handleChange = (e) => {
//     onInputChange(e.target.value); // ← 親からの関数を実行して値を渡す
//   };

//   return <input className='border' type="text" onChange={handleChange} />;
// };
    
//     return (<>
//     <h1>Carts PAGE</h1>
//     <Parent />

//     </>)

// }

// export default Carts;

// AddButton.tsx

import Home from '@/pages/Home'
import CartList from'@/pages/CartList'
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
