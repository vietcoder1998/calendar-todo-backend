// src/types/index.ts
export type User = {
  id: number;
  name: string;
  email: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
};

export type Comment = {
  id: number;
  content: string;
  postId: number;
  authorId: number;
};
