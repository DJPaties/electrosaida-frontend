// types/interfaces.ts

export interface Category {
  id: number;
  title: string;
  subTitle: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  hoverImage: string;
  pdf: string;
  inStock: number;
  createdAt: string;
  categoryId: number;
  category: Category;
}
