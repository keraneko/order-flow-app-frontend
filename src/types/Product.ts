export interface ProductFormValues {
  name: string;
  price: string;
  image: string | null;
  imageFile: File | null;
  isActive: boolean;
  isVisible: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string | null;
  isActive: boolean;
  isVisible: boolean;
}
