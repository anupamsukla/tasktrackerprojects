export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          dev_status: 'todo' | 'in-progress' | 'completed'
          qa_status: 'todo' | 'in-progress' | 'completed'
          final_status: 'todo' | 'in-progress' | 'completed'
          priority: 'low' | 'medium' | 'high'
          due_date: string | null
          user_id: string
          project_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          dev_status?: 'todo' | 'in-progress' | 'completed'
          qa_status?: 'todo' | 'in-progress' | 'completed'
          final_status?: 'todo' | 'in-progress' | 'completed'
          priority: 'low' | 'medium' | 'high'
          due_date?: string | null
          user_id: string
          project_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          dev_status?: 'todo' | 'in-progress' | 'completed'
          qa_status?: 'todo' | 'in-progress' | 'completed'
          final_status?: 'todo' | 'in-progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          user_id?: string
          project_id?: string
        }
      }
    }
  }
}
