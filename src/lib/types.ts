export type User = {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
};

export type Location = {
  lat: number;
  lng: number;
  address?: string;
};

export type ReportStatus = 'submitted' | 'in_review' | 'in_progress' | 'resolved' | 'rejected';

export type Message = {
  id: string;
  reportId: string;
  sender: 'user' | 'city';
  text: string;
  createdAt: string;
  system?: boolean;
};

export type Report = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  photoUrl: string;
  location: Location;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
};

// Auth types
export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  token?: string;
};

// Form types
export type CreateReportInput = {
  title: string;
  description?: string;
  photoFile: File;
  location: Location;
};

export type SendMessageInput = {
  reportId: string;
  text: string;
};
