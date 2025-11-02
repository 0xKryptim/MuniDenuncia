import type { User, Report, Message, LoginCredentials, AuthResponse, CreateReportInput, SendMessageInput } from '../types';

export interface DataAdapter {
  // Auth
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;

  // Reports
  getReports(userId: string): Promise<Report[]>;
  getReport(id: string): Promise<Report>;
  createReport(input: CreateReportInput, userId: string): Promise<Report>;
  uploadPhoto(file: File): Promise<string>;

  // Messages
  getMessages(reportId: string): Promise<Message[]>;
  sendMessage(input: SendMessageInput, userId: string): Promise<Message>;
  subscribeToMessages?(reportId: string, callback: (message: Message) => void): () => void;
}
