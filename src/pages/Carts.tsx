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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function Carts() {
  

  return (
    <>
    <Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="">注文商品</TableHead>
      <TableHead>数量</TableHead>
      <TableHead>単価</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="">弁当</TableCell>
      <TableCell>Paid個</TableCell>
      <TableCell>Credit Card円</TableCell>
    </TableRow>
  </TableBody>
</Table>
</>)

}

export default Carts;
