export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
}

export interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  available: boolean;
  category_id: number;
  images: ProductImage[]; // Cambié File[] a ProductImage[]
}
