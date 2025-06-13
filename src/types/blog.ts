export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  updatedDate?: string;
  categories: string[];
  tags: string[];
  readTime: number; // en minutes
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  faq?: FAQItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
}
