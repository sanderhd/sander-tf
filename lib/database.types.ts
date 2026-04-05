export type Role = "USER" | "ADMIN";

export type Database = {
  public: {
    Tables: {
      User: {
        Row: {
          id: string;
          email: string;
          passwordHash: string;
          role: Role;
          createdAt: string;
        };
        Insert: {
          id?: string;
          email: string;
          passwordHash: string;
          role?: Role;
          createdAt?: string;
        };
        Update: {
          id?: string;
          email?: string;
          passwordHash?: string;
          role?: Role;
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
      Role: Role;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};