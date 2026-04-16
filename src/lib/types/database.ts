export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          surgery_date: string | null;
          target_return_date: string | null;
          throw_hand: "left" | "right" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          surgery_date?: string | null;
          target_return_date?: string | null;
          throw_hand?: "left" | "right" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          surgery_date?: string | null;
          target_return_date?: string | null;
          throw_hand?: "left" | "right" | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      rehab_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          phase: number;
          rom_flexion: number | null;
          rom_extension: number | null;
          pain_level: number | null;
          grip_strength: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          phase: number;
          rom_flexion?: number | null;
          rom_extension?: number | null;
          pain_level?: number | null;
          grip_strength?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          phase?: number;
          rom_flexion?: number | null;
          rom_extension?: number | null;
          pain_level?: number | null;
          grip_strength?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      itp_sessions: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          step: number;
          distance: number | null;
          throw_count: number | null;
          intensity_pct: number | null;
          pain_level: number | null;
          advanced: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          step: number;
          distance?: number | null;
          throw_count?: number | null;
          intensity_pct?: number | null;
          pain_level?: number | null;
          advanced?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          step?: number;
          distance?: number | null;
          throw_count?: number | null;
          intensity_pct?: number | null;
          pain_level?: number | null;
          advanced?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          category: "velocity" | "movement" | "strength" | "rehab" | "custom";
          title: string;
          start_value: number | null;
          current_value: number | null;
          target_value: number | null;
          unit: string | null;
          target_date: string | null;
          status: "active" | "completed" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: "velocity" | "movement" | "strength" | "rehab" | "custom";
          title: string;
          start_value?: number | null;
          current_value?: number | null;
          target_value?: number | null;
          unit?: string | null;
          target_date?: string | null;
          status?: "active" | "completed" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: "velocity" | "movement" | "strength" | "rehab" | "custom";
          title?: string;
          start_value?: number | null;
          current_value?: number | null;
          target_value?: number | null;
          unit?: string | null;
          target_date?: string | null;
          status?: "active" | "completed" | "archived";
          created_at?: string;
          updated_at?: string;
        };
      };
      wellness_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          sleep_hours: number | null;
          sleep_quality: number | null;
          mood: number | null;
          soreness: number | null;
          energy: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          sleep_hours?: number | null;
          sleep_quality?: number | null;
          mood?: number | null;
          soreness?: number | null;
          energy?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          sleep_hours?: number | null;
          sleep_quality?: number | null;
          mood?: number | null;
          soreness?: number | null;
          energy?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
