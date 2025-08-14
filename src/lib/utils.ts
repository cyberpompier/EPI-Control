import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(nom: string, prenom: string): string {
  const nomInitial = nom ? nom.charAt(0).toUpperCase() : '';
  const prenomInitial = prenom ? prenom.charAt(0).toUpperCase() : '';
  return `${prenomInitial}${nomInitial}`;
}