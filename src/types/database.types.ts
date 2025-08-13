export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      habillement: {
        Row: {
          id: number
          article: string
          description: string | null
          taille: string | null
          image: string | null
          code: string | null
          personnel_id: number | null
          status: string | null
        }
        Insert: {
          id?: number
          article: string
          description?: string | null
          taille?: string | null
          image?: string | null
          code?: string | null
          personnel_id?: number | null
          status?: string | null
        }
        Update: {
          id?: number
          article?: string
          description?: string | null
          taille?: string | null
          image?: string | null
          code?: string | null
          personnel_id?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "habillement_personnel_id_fkey"
            columns: ["personnel_id"]
            referencedRelation: "personnel"
            referencedColumns: ["id"]
          }
        ]
      }
      personnel: {
        Row: {
          id: number
          nom: string | null
          email: string | null
          prenom: string | null
          caserne: string | null
          grade: string | null
          photo: string | null
          code: number | null
        }
        Insert: {
          id?: number
          nom?: string | null
          email?: string | null
          prenom?: string | null
          caserne?: string | null
          grade?: string | null
          photo?: string | null
          code?: number | null
        }
        Update: {
          id?: number
          nom?: string | null
          email?: string | null
          prenom?: string | null
          caserne?: string | null
          grade?: string | null
          photo?: string | null
          code?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}