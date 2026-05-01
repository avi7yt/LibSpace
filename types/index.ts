export interface Seat {
  seat_id: number;
  zone: 'quiet' | 'group';
  is_buffer: boolean;
  status: 'free' | 'occupied' | 'reserved';
}

export interface Student {
  roll_no: string;
  name: string;
  email: string;
  personalise_on: boolean;
}

export interface Session {
  session_id: number;
  roll_no: string;
  seat_id: number;
  check_in: string;
  check_out: string | null;
  status: 'active' | 'closed';
}

export interface Book {
  book_id: number;
  title: string;
  author: string;
  subject: string;
  available: boolean;
  total_copies: number;
}

export interface BookIssue {
  issue_id: number;
  roll_no: string;
  book_id: number;
  issued_on: string;
  due_date: string;
  returned: boolean;
}