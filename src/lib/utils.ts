import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(nom: string, prenom: string) {
  if (!nom || !prenom) return '';
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}