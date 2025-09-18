export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      jobs: {
        Row: {
          created_at: string | null
          customer_id: string | null
          customer_rating: number | null
          customer_review: string | null
          description: string | null
          destination: string | null
          id: string
          job_size: Database["public"]["Enums"]["job_size"]
          location: string
          price: number
          scheduled_date: string | null
          scheduled_time: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at: string | null
          worker_id: string | null
          worker_rating: number | null
          worker_review: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          customer_rating?: number | null
          customer_review?: string | null
          description?: string | null
          destination?: string | null
          id?: string
          job_size: Database["public"]["Enums"]["job_size"]
          location: string
          price: number
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at?: string | null
          worker_id?: string | null
          worker_rating?: number | null
          worker_review?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          customer_rating?: number | null
          customer_review?: string | null
          description?: string | null
          destination?: string | null
          id?: string
          job_size?: Database["public"]["Enums"]["job_size"]
          location?: string
          price?: number
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
          updated_at?: string | null
          worker_id?: string | null
          worker_rating?: number | null
          worker_review?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          job_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      prejob_checklist: {
        Row: {
          checked: boolean | null
          id: string
          item: string | null
          job_id: string | null
          mover_id: string | null
        }
        Insert: {
          checked?: boolean | null
          id?: string
          item?: string | null
          job_id?: string | null
          mover_id?: string | null
        }
        Update: {
          checked?: boolean | null
          id?: string
          item?: string | null
          job_id?: string | null
          mover_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prejob_checklist_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prejob_checklist_mover_id_fkey"
            columns: ["mover_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          available_days: string[] | null
          badges: string[] | null
          created_at: string
          email: string
          id: string
          job_count: number | null
          pause_matching: boolean | null
          performance_score: number | null
          referral_points: number | null
          skills: string[] | null
          university: string | null
          updated_at: string
        }
        Insert: {
          available_days?: string[] | null
          badges?: string[] | null
          created_at?: string
          email: string
          id: string
          job_count?: number | null
          pause_matching?: boolean | null
          performance_score?: number | null
          referral_points?: number | null
          skills?: string[] | null
          university?: string | null
          updated_at?: string
        }
        Update: {
          available_days?: string[] | null
          badges?: string[] | null
          created_at?: string
          email?: string
          id?: string
          job_count?: number | null
          pause_matching?: boolean | null
          performance_score?: number | null
          referral_points?: number | null
          skills?: string[] | null
          university?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      providers: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_verified: boolean | null
          phone: string | null
          services: string[] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          services?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          services?: string[] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          job_id: string | null
          mover_id: string | null
          rating: number | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          job_id?: string | null
          mover_id?: string | null
          rating?: number | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          job_id?: string | null
          mover_id?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_mover_id_fkey"
            columns: ["mover_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_applications: {
        Row: {
          availability: string | null
          created_at: string
          email: string | null
          experience: string | null
          full_name: string | null
          id: number
          services: string | null
          submitted_at: string | null
        }
        Insert: {
          availability?: string | null
          created_at?: string
          email?: string | null
          experience?: string | null
          full_name?: string | null
          id?: number
          services?: string | null
          submitted_at?: string | null
        }
        Update: {
          availability?: string | null
          created_at?: string
          email?: string | null
          experience?: string | null
          full_name?: string | null
          id?: number
          services?: string | null
          submitted_at?: string | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          created_at: string
          destination: string | null
          email: string | null
          id: number
          location: string | null
          move_option: string | null
          move_type: string | null
          phone: string | null
          preferred_date: string | null
          preferred_time: string | null
          present_location: string | null
          referral_code: string | null
          room_size: string | null
          service_type: string | null
        }
        Insert: {
          created_at?: string
          destination?: string | null
          email?: string | null
          id?: number
          location?: string | null
          move_option?: string | null
          move_type?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          present_location?: string | null
          referral_code?: string | null
          room_size?: string | null
          service_type?: string | null
        }
        Update: {
          created_at?: string
          destination?: string | null
          email?: string | null
          id?: number
          location?: string | null
          move_option?: string | null
          move_type?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          present_location?: string | null
          referral_code?: string | null
          room_size?: string | null
          service_type?: string | null
        }
        Relationships: []
      }
      sos_alerts: {
        Row: {
          created_at: string | null
          id: string
          lat: number | null
          lng: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sos_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      training_modules: {
        Row: {
          badge_reward: Database["public"]["Enums"]["badge_type"] | null
          content_url: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          title: string
        }
        Insert: {
          badge_reward?: Database["public"]["Enums"]["badge_type"] | null
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          title: string
        }
        Update: {
          badge_reward?: Database["public"]["Enums"]["badge_type"] | null
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      training_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: string
          module_id: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          module_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          module_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          phone_number: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          phone_number?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          phone_number?: string | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          id: string
          university: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          university: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          university?: string
          user_id?: string | null
        }
        Relationships: []
      }
      worker_badges: {
        Row: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          earned_at: string | null
          id: string
          worker_id: string | null
        }
        Insert: {
          badge_type: Database["public"]["Enums"]["badge_type"]
          earned_at?: string | null
          id?: string
          worker_id?: string | null
        }
        Update: {
          badge_type?: Database["public"]["Enums"]["badge_type"]
          earned_at?: string | null
          id?: string
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "worker_badges_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_training_progress: {
        Row: {
          completed_at: string | null
          id: string
          module_id: string | null
          progress_percentage: number | null
          worker_id: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          module_id?: string | null
          progress_percentage?: number | null
          worker_id?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          module_id?: string | null
          progress_percentage?: number | null
          worker_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "worker_training_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_training_progress_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      workers: {
        Row: {
          availability_schedule: Json | null
          created_at: string | null
          full_name: string
          id: string
          is_verified: boolean | null
          location: string | null
          phone: string | null
          photo_url: string | null
          rating: number | null
          skills: string[] | null
          status: Database["public"]["Enums"]["worker_status"] | null
          total_earnings: number | null
          total_jobs: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          availability_schedule?: Json | null
          created_at?: string | null
          full_name: string
          id?: string
          is_verified?: boolean | null
          location?: string | null
          phone?: string | null
          photo_url?: string | null
          rating?: number | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["worker_status"] | null
          total_earnings?: number | null
          total_jobs?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          availability_schedule?: Json | null
          created_at?: string | null
          full_name?: string
          id?: string
          is_verified?: boolean | null
          location?: string | null
          phone?: string | null
          photo_url?: string | null
          rating?: number | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["worker_status"] | null
          total_earnings?: number | null
          total_jobs?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      badge_type:
        | "5_star_pro"
        | "mover_of_month"
        | "certified_packing"
        | "speed_demon"
        | "customer_favorite"
      job_size: "light" | "medium" | "heavy"
      job_status:
        | "open"
        | "assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
      payment_status: "pending" | "processing" | "paid" | "failed"
      worker_status: "available" | "busy" | "paused" | "offline"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      badge_type: [
        "5_star_pro",
        "mover_of_month",
        "certified_packing",
        "speed_demon",
        "customer_favorite",
      ],
      job_size: ["light", "medium", "heavy"],
      job_status: ["open", "assigned", "in_progress", "completed", "cancelled"],
      payment_status: ["pending", "processing", "paid", "failed"],
      worker_status: ["available", "busy", "paused", "offline"],
    },
  },
} as const
