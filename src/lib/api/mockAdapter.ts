import type { DataAdapter } from './adapter';
import type { User, Report, Message, LoginCredentials, AuthResponse, CreateReportInput, SendMessageInput } from '../types';

// In-memory storage
let currentUser: User | null = null;
const reports: Report[] = [];
let reportIdCounter = 1;
let messageIdCounter = 1;

// Mock users
const MOCK_USERS: Record<string, { user: User; password: string }> = {
  'user@example.com': {
    user: {
      id: '1',
      email: 'user@example.com',
      name: 'Jean Dupont',
      avatarUrl: undefined,
    },
    password: 'password123',
  },
};

export const mockAdapter: DataAdapter = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

    const userRecord = MOCK_USERS[credentials.email];
    if (!userRecord || userRecord.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    currentUser = userRecord.user;
    localStorage.setItem('mock_user', JSON.stringify(currentUser));

    return { user: currentUser };
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    currentUser = null;
    localStorage.removeItem('mock_user');
  },

  async getCurrentUser(): Promise<User | null> {
    if (currentUser) return currentUser;

    const stored = localStorage.getItem('mock_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }

    return null;
  },

  async getReports(userId: string): Promise<Report[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return reports.filter((r) => r.userId === userId).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getReport(id: string): Promise<Report> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const report = reports.find((r) => r.id === id);
    if (!report) throw new Error('Report not found');
    return report;
  },

  async createReport(input: CreateReportInput, userId: string): Promise<Report> {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate upload time

    const photoUrl = await mockAdapter.uploadPhoto(input.photoFile);
    const now = new Date().toISOString();
    const reportId = String(reportIdCounter++);

    const systemMessage: Message = {
      id: String(messageIdCounter++),
      reportId,
      sender: 'city',
      text: 'We have received your request. Our team will review it shortly.',
      createdAt: now,
      system: true,
    };

    const report: Report = {
      id: reportId,
      userId,
      title: input.title,
      description: input.description,
      photoUrl,
      location: input.location,
      status: 'submitted',
      createdAt: now,
      updatedAt: now,
      messages: [systemMessage],
    };

    reports.push(report);
    return report;
  },

  async uploadPhoto(file: File): Promise<string> {
    // Simulate upload by creating a local object URL
    return URL.createObjectURL(file);
  },

  async getMessages(reportId: string): Promise<Message[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const report = reports.find((r) => r.id === reportId);
    if (!report) throw new Error('Report not found');
    return report.messages;
  },

  async sendMessage(input: SendMessageInput, userId: string): Promise<Message> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const report = reports.find((r) => r.id === input.reportId);
    if (!report) throw new Error('Report not found');

    const message: Message = {
      id: String(messageIdCounter++),
      reportId: input.reportId,
      sender: 'user',
      text: input.text,
      createdAt: new Date().toISOString(),
    };

    report.messages.push(message);
    return message;
  },
};
