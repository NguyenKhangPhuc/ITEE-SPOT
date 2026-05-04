export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      event_awards: {
        Row: {
          award_priority: number | null
          award_title: string | null
          award_type: Database["public"]["Enums"]["AWARD_TYPE"] | null
          event_id: string | null
          id: string
        }
        Insert: {
          award_priority?: number | null
          award_title?: string | null
          award_type?: Database["public"]["Enums"]["AWARD_TYPE"] | null
          event_id?: string | null
          id?: string
        }
        Update: {
          award_priority?: number | null
          award_title?: string | null
          award_type?: Database["public"]["Enums"]["AWARD_TYPE"] | null
          event_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_awards_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_challenges: {
        Row: {
          company_name: string | null
          created_at: string
          event_id: string | null
          id: string
          title: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          title?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_challenges_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_grading_criteria: {
        Row: {
          created_at: string
          criteria_description: string | null
          criteria_name: string | null
          event_id: string | null
          id: string
          percentage: number | null
          type: Database["public"]["Enums"]["CRITERIA_TYPE"] | null
        }
        Insert: {
          created_at?: string
          criteria_description?: string | null
          criteria_name?: string | null
          event_id?: string | null
          id?: string
          percentage?: number | null
          type?: Database["public"]["Enums"]["CRITERIA_TYPE"] | null
        }
        Update: {
          created_at?: string
          criteria_description?: string | null
          criteria_name?: string | null
          event_id?: string | null
          id?: string
          percentage?: number | null
          type?: Database["public"]["Enums"]["CRITERIA_TYPE"] | null
        }
        Relationships: [
          {
            foreignKeyName: "event_grading_criteria_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          content: string | null
          created_at: string
          end_date: string | null
          id: string
          location: string | null
          max_group_members: number | null
          organized_date: string | null
          owner_id: string | null
          poster_path: string | null
          short_description: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["EVENT_STATUS"] | null
          title: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          location?: string | null
          max_group_members?: number | null
          organized_date?: string | null
          owner_id?: string | null
          poster_path?: string | null
          short_description?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["EVENT_STATUS"] | null
          title?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          location?: string | null
          max_group_members?: number | null
          organized_date?: string | null
          owner_id?: string | null
          poster_path?: string | null
          short_description?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["EVENT_STATUS"] | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fun_facts: {
        Row: {
          created_at: string
          fact: string | null
          id: string
          submission_id: string | null
        }
        Insert: {
          created_at?: string
          fact?: string | null
          id?: string
          submission_id?: string | null
        }
        Update: {
          created_at?: string
          fact?: string | null
          id?: string
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fun_facts_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_challenge: {
        Row: {
          challenge_id: string | null
          created_at: string
          event_id: string | null
          group_id: string | null
          id: string
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string
          event_id?: string | null
          group_id?: string | null
          id?: string
        }
        Update: {
          challenge_id?: string | null
          created_at?: string
          event_id?: string | null
          group_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_challenge_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "event_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_challenge_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_challenge_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          created_at: string
          group_id: string | null
          id: string
          member_id: string | null
        }
        Insert: {
          created_at?: string
          group_id?: string | null
          id?: string
          member_id?: string | null
        }
        Update: {
          created_at?: string
          group_id?: string | null
          id?: string
          member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          event_id: string | null
          group_name: string | null
          id: string
          poster_path: string | null
          short_description: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          group_name?: string | null
          id?: string
          poster_path?: string | null
          short_description?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          group_name?: string | null
          id?: string
          poster_path?: string | null
          short_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation: {
        Row: {
          created_at: string
          group_id: string | null
          id: string
          invitation_status:
            | Database["public"]["Enums"]["INVITATION_STATUS"]
            | null
          member_email: string | null
        }
        Insert: {
          created_at?: string
          group_id?: string | null
          id?: string
          invitation_status?:
            | Database["public"]["Enums"]["INVITATION_STATUS"]
            | null
          member_email?: string | null
        }
        Update: {
          created_at?: string
          group_id?: string | null
          id?: string
          invitation_status?:
            | Database["public"]["Enums"]["INVITATION_STATUS"]
            | null
          member_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitation_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitation_member_email_fkey"
            columns: ["member_email"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["email"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          company_unit: string | null
          degree: Database["public"]["Enums"]["DEGREE"] | null
          email: string | null
          full_name: string | null
          github: string | null
          id: string
          job_title: string | null
          linkedIn: string | null
          programme: Database["public"]["Enums"]["PROGRAMME"] | null
          role: Database["public"]["Enums"]["PROFILE_ROLE"] | null
          university: Database["public"]["Enums"]["UNIVERSITY"] | null
          year: Database["public"]["Enums"]["YEAR"] | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          company_unit?: string | null
          degree?: Database["public"]["Enums"]["DEGREE"] | null
          email?: string | null
          full_name?: string | null
          github?: string | null
          id: string
          job_title?: string | null
          linkedIn?: string | null
          programme?: Database["public"]["Enums"]["PROGRAMME"] | null
          role?: Database["public"]["Enums"]["PROFILE_ROLE"] | null
          university?: Database["public"]["Enums"]["UNIVERSITY"] | null
          year?: Database["public"]["Enums"]["YEAR"] | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          company_unit?: string | null
          degree?: Database["public"]["Enums"]["DEGREE"] | null
          email?: string | null
          full_name?: string | null
          github?: string | null
          id?: string
          job_title?: string | null
          linkedIn?: string | null
          programme?: Database["public"]["Enums"]["PROGRAMME"] | null
          role?: Database["public"]["Enums"]["PROFILE_ROLE"] | null
          university?: Database["public"]["Enums"]["UNIVERSITY"] | null
          year?: Database["public"]["Enums"]["YEAR"] | null
        }
        Relationships: []
      }
      project_awards: {
        Row: {
          award_id: string | null
          created_at: string
          id: number
          project_id: string | null
        }
        Insert: {
          award_id?: string | null
          created_at?: string
          id?: number
          project_id?: string | null
        }
        Update: {
          award_id?: string | null
          created_at?: string
          id?: number
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_awards_award_id_fkey"
            columns: ["award_id"]
            isOneToOne: false
            referencedRelation: "event_awards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_awards_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_files: {
        Row: {
          created_at: string
          group_id: string | null
          id: string
          mime_type: string | null
          original_file_name: string | null
          project_id: string | null
          size: number | null
          storage_path: string | null
        }
        Insert: {
          created_at?: string
          group_id?: string | null
          id?: string
          mime_type?: string | null
          original_file_name?: string | null
          project_id?: string | null
          size?: number | null
          storage_path?: string | null
        }
        Update: {
          created_at?: string
          group_id?: string | null
          id?: string
          mime_type?: string | null
          original_file_name?: string | null
          project_id?: string | null
          size?: number | null
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_files_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          github_link: string | null
          group_challenge_id: string | null
          group_id: string | null
          id: string
          project_status: Database["public"]["Enums"]["PROJECTS_STATUS"] | null
          project_title: string | null
          short_description: string | null
          youtube_link: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          github_link?: string | null
          group_challenge_id?: string | null
          group_id?: string | null
          id?: string
          project_status?: Database["public"]["Enums"]["PROJECTS_STATUS"] | null
          project_title?: string | null
          short_description?: string | null
          youtube_link?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          github_link?: string | null
          group_challenge_id?: string | null
          group_id?: string | null
          id?: string
          project_status?: Database["public"]["Enums"]["PROJECTS_STATUS"] | null
          project_title?: string | null
          short_description?: string | null
          youtube_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_group_challenge_id_fkey"
            columns: ["group_challenge_id"]
            isOneToOne: false
            referencedRelation: "group_challenge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "group_challenge"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_comments: {
        Row: {
          content: string | null
          created_at: string
          display_name: string | null
          id: string
          submission_id: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          submission_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          submission_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_comments_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_feedbacks: {
        Row: {
          content: string | null
          created_at: string
          display_name: string | null
          id: string
          submission_id: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          submission_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          submission_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_feedbacks_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_feedbacks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_files: {
        Row: {
          created_at: string
          group_id: string | null
          id: string
          mime_type: string | null
          original_file_name: string | null
          size: number | null
          storage_path: string | null
          submission_id: string | null
        }
        Insert: {
          created_at?: string
          group_id?: string | null
          id?: string
          mime_type?: string | null
          original_file_name?: string | null
          size?: number | null
          storage_path?: string | null
          submission_id?: string | null
        }
        Update: {
          created_at?: string
          group_id?: string | null
          id?: string
          mime_type?: string | null
          original_file_name?: string | null
          size?: number | null
          storage_path?: string | null
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_files_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_files_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_grading: {
        Row: {
          created_at: string
          event_criteria_id: string | null
          grade: number | null
          id: string
          submission_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_criteria_id?: string | null
          grade?: number | null
          id?: string
          submission_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_criteria_id?: string | null
          grade?: number | null
          id?: string
          submission_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_grading_event_criteria_id_fkey"
            columns: ["event_criteria_id"]
            isOneToOne: false
            referencedRelation: "event_grading_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_grading_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_grading_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_ratings: {
        Row: {
          created_at: string
          id: string
          rating: number | null
          submission_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          rating?: number | null
          submission_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number | null
          submission_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_rating_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_rating_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_reactions: {
        Row: {
          created_at: string
          id: string
          submission_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          submission_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          submission_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_reactions_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          created_at: string
          description: string | null
          github_link: string | null
          group_challenge_id: string | null
          group_id: string | null
          id: string
          short_description: string | null
          title: string | null
          youtube_link: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          github_link?: string | null
          group_challenge_id?: string | null
          group_id?: string | null
          id?: string
          short_description?: string | null
          title?: string | null
          youtube_link?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          github_link?: string | null
          group_challenge_id?: string | null
          group_id?: string | null
          id?: string
          short_description?: string | null
          title?: string | null
          youtube_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_group_challenge_id_fkey"
            columns: ["group_challenge_id"]
            isOneToOne: false
            referencedRelation: "group_challenge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      submission_final_scores: {
        Row: {
          final_average_score: number | null
          submission_id: string | null
          total_graders: number | null
        }
        Relationships: [
          {
            foreignKeyName: "submission_grading_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      AWARD_TYPE: "general" | "specific" | "participant"
      CRITERIA_TYPE: "normal" | "specific"
      DEGREE: "Bachelor" | "Master" | "Ph.D"
      EVENT_STATUS: "ongoing" | "finished"
      INVITATION_STATUS: "pending" | "rejected" | "accepted"
      PROFILE_ROLE: "admin" | "student" | "judge"
      PROGRAMME:
        | "Information Processing Science"
        | "Electronics and Communications Engineering"
        | "Computer Science and Engineering"
        | "Biomedical Engineering"
      PROJECTS_STATUS: "pending" | "accepted" | "rejected"
      UNIVERSITY: "University of Oulu" | "Oulu University of Applied Science"
      YEAR: "First Year" | "Second Year" | "Third Year" | "Fourth Year"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      AWARD_TYPE: ["general", "specific", "participant"],
      CRITERIA_TYPE: ["normal", "specific"],
      DEGREE: ["Bachelor", "Master", "Ph.D"],
      EVENT_STATUS: ["ongoing", "finished"],
      INVITATION_STATUS: ["pending", "rejected", "accepted"],
      PROFILE_ROLE: ["admin", "student", "judge"],
      PROGRAMME: [
        "Information Processing Science",
        "Electronics and Communications Engineering",
        "Computer Science and Engineering",
        "Biomedical Engineering",
      ],
      PROJECTS_STATUS: ["pending", "accepted", "rejected"],
      UNIVERSITY: ["University of Oulu", "Oulu University of Applied Science"],
      YEAR: ["First Year", "Second Year", "Third Year", "Fourth Year"],
    },
  },
} as const

