export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ad_sources: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      admissions: {
        Row: {
          admission_status: string
          alt_phone: string | null
          amount_paid: number
          checklist: Json
          course: string
          created_at: string
          dob: string | null
          email: string | null
          father_name: string | null
          full_name: string
          gender: string | null
          id: string
          intake: string
          lead_id: string | null
          marital_status: string | null
          mother_name: string | null
          payment_status: string
          permanent_address: string | null
          phone: string
          remarks: string | null
          scholarship_amount: number | null
          scholarship_type: string
          temporary_address: string | null
          total_fee: number | null
          updated_at: string
        }
        Insert: {
          admission_status?: string
          alt_phone?: string | null
          amount_paid?: number
          checklist?: Json
          course: string
          created_at?: string
          dob?: string | null
          email?: string | null
          father_name?: string | null
          full_name: string
          gender?: string | null
          id?: string
          intake: string
          lead_id?: string | null
          marital_status?: string | null
          mother_name?: string | null
          payment_status?: string
          permanent_address?: string | null
          phone: string
          remarks?: string | null
          scholarship_amount?: number | null
          scholarship_type?: string
          temporary_address?: string | null
          total_fee?: number | null
          updated_at?: string
        }
        Update: {
          admission_status?: string
          alt_phone?: string | null
          amount_paid?: number
          checklist?: Json
          course?: string
          created_at?: string
          dob?: string | null
          email?: string | null
          father_name?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          intake?: string
          lead_id?: string | null
          marital_status?: string | null
          mother_name?: string | null
          payment_status?: string
          permanent_address?: string | null
          phone?: string
          remarks?: string | null
          scholarship_amount?: number | null
          scholarship_type?: string
          temporary_address?: string | null
          total_fee?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admissions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      followups: {
        Row: {
          assigned_to: string | null
          attempts: number
          created_at: string
          id: string
          last_contacted_at: string | null
          last_remark: string | null
          last_status: Database["public"]["Enums"]["lead_status"] | null
          lead_id: string
          max_attempts: number
          next_follow_up_date: string | null
        }
        Insert: {
          assigned_to?: string | null
          attempts?: number
          created_at?: string
          id?: string
          last_contacted_at?: string | null
          last_remark?: string | null
          last_status?: Database["public"]["Enums"]["lead_status"] | null
          lead_id: string
          max_attempts?: number
          next_follow_up_date?: string | null
        }
        Update: {
          assigned_to?: string | null
          attempts?: number
          created_at?: string
          id?: string
          last_contacted_at?: string | null
          last_remark?: string | null
          last_status?: Database["public"]["Enums"]["lead_status"] | null
          lead_id?: string
          max_attempts?: number
          next_follow_up_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "followups_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followups_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_interactions: {
        Row: {
          at: string
          by_user: string | null
          id: string
          lead_id: string
          next_follow_up_date: string | null
          remarks: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
        }
        Insert: {
          at?: string
          by_user?: string | null
          id?: string
          lead_id: string
          next_follow_up_date?: string | null
          remarks?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
        }
        Update: {
          at?: string
          by_user?: string | null
          id?: string
          lead_id?: string
          next_follow_up_date?: string | null
          remarks?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          ad_source: string | null
          address: string | null
          alt_phone: string | null
          assigned_to: string | null
          course: string
          created_at: string
          created_by: string | null
          email: string | null
          friends: Json | null
          full_name: string
          gender: string | null
          gpa: string | null
          id: string
          institution: string | null
          intake: string
          next_follow_up_date: string | null
          notes: string | null
          phone: string
          qualification: string | null
          remarks: string | null
          source: Database["public"]["Enums"]["lead_source"]
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          visit_date: string | null
        }
        Insert: {
          ad_source?: string | null
          address?: string | null
          alt_phone?: string | null
          assigned_to?: string | null
          course: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          friends?: Json | null
          full_name: string
          gender?: string | null
          gpa?: string | null
          id?: string
          institution?: string | null
          intake: string
          next_follow_up_date?: string | null
          notes?: string | null
          phone: string
          qualification?: string | null
          remarks?: string | null
          source: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          visit_date?: string | null
        }
        Update: {
          ad_source?: string | null
          address?: string | null
          alt_phone?: string | null
          assigned_to?: string | null
          course?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
          friends?: Json | null
          full_name?: string
          gender?: string | null
          gpa?: string | null
          id?: string
          institution?: string | null
          intake?: string
          next_follow_up_date?: string | null
          notes?: string | null
          phone?: string
          qualification?: string | null
          remarks?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          visit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string
          id: string
          last_name?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          username?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      default_fee_for_course: { Args: { _course: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "counsellor" | "caller" | "accountant"
      lead_source: "Walk-in" | "Incoming" | "Website" | "AD" | "Event/Outreach"
      lead_status:
        | "Interested"
        | "Admitted"
        | "Will Apply for Next Intake"
        | "Will Visit College"
        | "Will Revisit"
        | "Follow-up Required"
        | "Want Detail in WhatsApp"
        | "CNR"
        | "Incoming Call Blocked"
        | "Expensive Fee"
        | "Not Interested"
        | "Joined Another College"
        | "Dead"
        | "CSV Upload"
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
      app_role: ["admin", "counsellor", "caller", "accountant"],
      lead_source: ["Walk-in", "Incoming", "Website", "AD", "Event/Outreach"],
      lead_status: [
        "Interested",
        "Admitted",
        "Will Apply for Next Intake",
        "Will Visit College",
        "Will Revisit",
        "Follow-up Required",
        "Want Detail in WhatsApp",
        "CNR",
        "Incoming Call Blocked",
        "Expensive Fee",
        "Not Interested",
        "Joined Another College",
        "Dead",
        "CSV Upload",
      ],
    },
  },
} as const
