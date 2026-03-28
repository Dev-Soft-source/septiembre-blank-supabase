
export interface JoinUsSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  recipient_email: string;
}

export interface JoinUsFile {
  id: string;
  submission_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
}

export interface ProcessedFile {
  filename: string;
  content: string;
  type: string;
  disposition: string;
}
