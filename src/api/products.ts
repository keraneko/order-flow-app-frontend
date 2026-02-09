import { type Product } from '@/types/product';

export interface ProductApi {
  id: number;
  name: string;
  price: number;
  image_path: string | null;
  is_active: boolean;
  is_visible: boolean;
}

const toProduct = (p: ProductApi): Product => ({
  id: p.id,
  name: p.name,
  price: p.price,
  image: p.image_path,
  isActive: p.is_active,
  isVisible: p.is_visible,
});

export async function getProducts(): Promise<Product[]> {
  const res = await fetch('/api/products');

  if (!res.ok) throw new Error(`HTTP${res.status}`);
  const data = (await res.json()) as ProductApi[];

  return data.map(toProduct);
}
