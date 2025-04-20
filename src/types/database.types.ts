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
      tasks: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          status: string
          priority: string
          due_date: string | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          status: string
          priority: string
          due_date?: string | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          due_date?: string | null
          user_id?: string
        }
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