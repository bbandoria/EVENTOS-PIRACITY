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
      venues: {
        Row: {
          id: string
          name: string
          address: string
          description: string
          image_url: string
          latitude: number
          longitude: number
          owner_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          description: string
          image_url: string
          latitude: number
          longitude: number
          owner_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          description?: string
          image_url?: string
          latitude?: number
          longitude?: number
          owner_id?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          time: string
          image_url: string
          venue_id: string
          owner_id: string
          created_at: string
          price: string
          category: string
          is_featured: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          time: string
          image_url: string
          venue_id: string
          owner_id: string
          created_at?: string
          price: string
          category: string
          is_featured?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          time?: string
          image_url?: string
          venue_id?: string
          owner_id?: string
          created_at?: string
          price?: string
          category?: string
          is_featured?: boolean
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
  }
} 