// import { useEffect, useState } from "react";

// type Product = {
//   id: number;
//   name: string;
//   price: number;
// };

// export default function Apitest() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetch("/api/products")
//       .then((response) => {
//         if (!response.ok) throw new Error(`HTTP ${response.status}`);
//         return response.json();
//       })
//       .then((data: Product[]) => {
//         setProducts(data);
//       })
//       .catch((e) => setError(e.message))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div>
//       <h1>Products</h1>
//       <ul>
//         {products.map((p) => (
//   <li key={p.id}>
//     {p.name} - {p.price}円{" "}
//     <button onClick={() => console.log("add", p.id)}>追加</button>
//   </li>
// ))}

//       </ul>
//     </div>
//   );
// }

// "use client"

// import { toast } from "sonner"

// import { Button } from "@/components/ui/button"

// export default function SonnerDemo() {
//   return (
//     <Button
//       variant="outline"
//       onClick={() =>
//         toast("Event has been created", {
//           description: "Sunday, December 03, 2023 at 9:00 AM",
//           action: {
//             label: "Undo",
//             onClick: () => console.log("Undo"),
//           },
//         })
//       }
//     >
//       Show Toast
//     </Button>
//   )
// }

import { useState } from 'react';

export default function ErrorTest() {
  const [crash, setCrash] = useState(false);

  if (crash) {
    throw new Error('ErrorBoundary検証: わざと落としました');
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>ErrorBoundary Test</h1>
      <button onClick={() => setCrash(true)}>クラッシュさせる</button>
    </div>
  );
}
