
export interface Payment {
  id: string;
  booking_id: string | null;
  user_id: string | null;
  hotel_id: string | null;
  amount: number;
  method: string;
  status: string;
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
  user_name?: string;
  hotel?: {
    name: string;
  };
  booking?: {
    check_in: string;
    check_out: string;
  };
}

export interface PaymentsState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: string;
  dateFilter: Date | undefined;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  page: number;
  totalCount: number;
  limit: number;
}
