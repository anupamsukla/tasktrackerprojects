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
          priority: 'blocker' | 'major' | 'high' | 'medium' | 'low'
          due_date: string | null
          user_id: string
          project_id: string
          dev_status_remarks: string | null
          qa_status_remarks: string | null
          final_status_remarks: string | null
          dev_status_changed_at: string | null
          qa_status_changed_at: string | null
          final_status_changed_at: string | null
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
          priority: 'blocker' | 'major' | 'high' | 'medium' | 'low'
          due_date?: string | null
          user_id: string
          project_id: string
          dev_status_remarks?: string | null
          qa_status_remarks?: string | null
          final_status_remarks?: string | null
          dev_status_changed_at?: string | null
          qa_status_changed_at?: string | null
          final_status_changed_at?: string | null
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
          priority?: 'blocker' | 'major' | 'high' | 'medium' | 'low'
          due_date?: string | null
          user_id?: string
          project_id?: string
          dev_status_remarks?: string | null
          qa_status_remarks?: string | null
          final_status_remarks?: string | null
          dev_status_changed_at?: string | null
          qa_status_changed_at?: string | null
          final_status_changed_at?: string | null
        }
      }
      status_changes: {
        Row: {
          id: string
          task_id: string
          status_type: 'dev' | 'qa' | 'final'
          statuses: ('todo' | 'in-progress' | 'completed')[]
          remarks: string
          changed_at: string
          changed_by: string
        }
        Insert: {
          id?: string
          task_id: string
          status_type: 'dev' | 'qa' | 'final'
          statuses: ('todo' | 'in-progress' | 'completed')[]
          remarks: string
          changed_at?: string
          changed_by: string
        }
        Update: {
          id?: string
          task_id?: string
          status_type?: 'dev' | 'qa' | 'final'
          statuses?: ('todo' | 'in-progress' | 'completed')[]
          remarks?: string
          changed_at?: string
          changed_by?: string
        }
      }
    }
  }
}
