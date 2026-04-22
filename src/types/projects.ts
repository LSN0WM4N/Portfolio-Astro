import type { Vector } from "./physics";

export type Coords = { 
  x: number, 
  y: number, 
};

export type Edge = {
  from: number;
  to: number;
}; 

export interface Node<T> {
  id: number;
  coords: Coords;
  data: T;
  force: Vector;
  velocity: Vector;
  pinned?: boolean;
}

export type Project = {
  title: string;
  description: string;
  github: string;
  tech: string[];
  featured: boolean;
  date: string | Date | number;
  image: string;
}