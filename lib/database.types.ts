export type ProfileRole = "USER" | "ADMIN";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          passwordHash: string;
          role: ProfileRole;
          createdAt: string;
        };
        Insert: {
          id?: string;
          email: string;
          passwordHash: string;
          role?: ProfileRole;
          createdAt?: string;
        };
        Update: {
          id?: string;
          email?: string;
          passwordHash?: string;
          role?: ProfileRole;
          createdAt?: string;
        };
        Relationships: [];
      };
      Blog: {
        Row: {
          id: string;
          title: string;
          slug: string | null;
          content: string | null;
          summary: string | null;
          thumbnail: string | null;
          published: boolean;
          createdAt: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string | null;
          content?: string | null;
          summary?: string | null;
          thumbnail?: string | null;
          published?: boolean;
          createdAt?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string | null;
          content?: string | null;
          summary?: string | null;
          thumbnail?: string | null;
          published?: boolean;
          createdAt?: string;
        };
        Relationships: [];
      };
      Project: {
        Row: {
          id: string;
          title: string;
          slug: string | null;
          content: string | null;
          summary: string | null;
          thumbnail: string | null;
          published: boolean;
          createdAt: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string | null;
          content?: string | null;
          summary?: string | null;
          thumbnail?: string | null;
          published?: boolean;
          createdAt?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string | null;
          content?: string | null;
          summary?: string | null;
          thumbnail?: string | null;
          published?: boolean;
          createdAt?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      profile_role: ProfileRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};