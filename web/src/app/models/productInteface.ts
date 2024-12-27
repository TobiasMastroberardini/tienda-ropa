export interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  available: boolean;
  category_id: number;
  images: File[]; // Cambié File[] a ProductImage[]
}
