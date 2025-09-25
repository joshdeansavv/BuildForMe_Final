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
      bots: {
        Row: {
          avatar_url: string | null
          client_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      guilds: {
        Row: {
          created_at: string
          features: string[]
          icon: string | null
          id: string
          member_count: number
          name: string
          owner_id: string | null
          permissions: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          features?: string[]
          icon?: string | null
          id: string
          member_count?: number
          name: string
          owner_id?: string | null
          permissions: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          features?: string[]
          icon?: string | null
          id?: string
          member_count?: number
          name?: string
          owner_id?: string | null
          permissions?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invite_logs: {
        Row: {
          created_at: string
          guild_id: string
          guild_name: string
          id: string
          invite_url: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          guild_id: string
          guild_name: string
          id?: string
          invite_url: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          guild_id?: string
          guild_name?: string
          id?: string
          invite_url?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      premium_servers: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          guild_id: string
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          guild_id: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          guild_id?: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          discord_id: string | null
          email: string | null
          id: string
          stripe_customer_id: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          discord_id?: string | null
          email?: string | null
          id: string
          stripe_customer_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          discord_id?: string | null
          email?: string | null
          id?: string
          stripe_customer_id?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      server_bots: {
        Row: {
          added_at: string
          added_by: string | null
          bot_id: string | null
          id: string
          is_active: boolean | null
          server_id: string | null
        }
        Insert: {
          added_at?: string
          added_by?: string | null
          bot_id?: string | null
          id?: string
          is_active?: boolean | null
          server_id?: string | null
        }
        Update: {
          added_at?: string
          added_by?: string | null
          bot_id?: string | null
          id?: string
          is_active?: boolean | null
          server_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_bots_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "server_bots_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "server_bots_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      servers: {
        Row: {
          created_at: string
          discord_server_id: string
          icon_url: string | null
          id: string
          is_bot_added: boolean | null
          member_count: number | null
          name: string
          owner_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          discord_server_id: string
          icon_url?: string | null
          id?: string
          is_bot_added?: boolean | null
          member_count?: number | null
          name: string
          owner_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          discord_server_id?: string
          icon_url?: string | null
          id?: string
          is_bot_added?: boolean | null
          member_count?: number | null
          name?: string
          owner_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "servers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_bots_per_server: number | null
          max_servers: number | null
          name: string
          price_monthly: number
          price_yearly: number | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_bots_per_server?: number | null
          max_servers?: number | null
          name: string
          price_monthly: number
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_bots_per_server?: number | null
          max_servers?: number | null
          name?: string
          price_monthly?: number
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_can_access_server: {
        Args: { server_id: string }
        Returns: boolean
      }
      get_server_subscription_status: {
        Args: { server_id_param: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
