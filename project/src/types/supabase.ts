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
      profiles: {
        Row: {
          id: string
          role: 'worker' | 'customer'
          full_name: string | null
          email: string
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: 'worker' | 'customer'
          full_name?: string | null
          email: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'worker' | 'customer'
          full_name?: string | null
          email?: string
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      worker_profiles: {
        Row: {
          id: string
          service_category: string
          experience_years: number
          hourly_rate: number
          fixed_rate: number
          bio: string | null
          languages: string[]
          rating: number
          total_jobs: number
          verification_status: 'pending' | 'verified' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          service_category: string
          experience_years: number
          hourly_rate: number
          fixed_rate: number
          bio?: string | null
          languages?: string[]
          rating?: number
          total_jobs?: number
          verification_status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_category?: string
          experience_years?: number
          hourly_rate?: number
          fixed_rate?: number
          bio?: string | null
          languages?: string[]
          rating?: number
          total_jobs?: number
          verification_status?: 'pending' | 'verified' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      portfolio_items: {
        Row: {
          id: string
          worker_id: string
          title: string
          description: string | null
          media_url: string
          media_type: 'image' | 'video'
          created_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          title: string
          description?: string | null
          media_url: string
          media_type: 'image' | 'video'
          created_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          title?: string
          description?: string | null
          media_url?: string
          media_type?: 'image' | 'video'
          created_at?: string
        }
      }
      service_areas: {
        Row: {
          id: string
          worker_id: string
          city: string
          state: string
          radius_km: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          city: string
          state: string
          radius_km: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          city?: string
          state?: string
          radius_km?: number
          created_at?: string
          updated_at?: string
        }
      }
      availability: {
        Row: {
          id: string
          worker_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          worker_id: string
          customer_id: string
          service_category: string
          booking_date: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          price: number
          payment_status: 'pending' | 'paid' | 'refunded'
          requirements: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          customer_id: string
          service_category: string
          booking_date: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          price: number
          payment_status?: 'pending' | 'paid' | 'refunded'
          requirements?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          customer_id?: string
          service_category?: string
          booking_date?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          price?: number
          payment_status?: 'pending' | 'paid' | 'refunded'
          requirements?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}