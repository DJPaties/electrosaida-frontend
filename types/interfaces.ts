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
  features: string[];
  categoryId: number;
  category: Category;
}


export interface Country {
  code: string;
  name: string;
  dialcode: string;
}