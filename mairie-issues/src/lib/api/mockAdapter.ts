import type { DataAdapter } from './adapter';
import type { User, Report, Message, LoginCredentials, AuthResponse, CreateReportInput, SendMessageInput } from '../types';

// In-memory storage
let currentUser: User | null = null;
let reportIdCounter = 4; // Start at 4 since we have 3 sample reports
let messageIdCounter = 10; // Start at 10 since we have sample messages

// Sample reports with different statuses
const reports: Report[] = [
  {
    id: '1',
    userId: '1',
    title: 'Farola rota en la Calle Principal',
    description: 'La farola en la esquina de Calle Principal y Av. Robles ha estado apagada durante la última semana. Hace que la intersección sea muy oscura e insegura por la noche.',
    photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    location: {
      lat: 48.8566,
      lng: 2.3522,
      address: '123 Calle Principal, París 75001'
    },
    status: 'in_progress',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: '1',
        reportId: '1',
        sender: 'city',
        text: 'Hemos recibido su solicitud. Nuestro equipo la revisará pronto.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        system: true
      },
      {
        id: '2',
        reportId: '1',
        sender: 'city',
        text: 'Gracias por reportar este problema. Nuestro equipo de mantenimiento ha sido enviado para reparar la farola.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        system: false
      },
      {
        id: '3',
        reportId: '1',
        sender: 'user',
        text: '¡Gracias por la rápida respuesta! ¿Cuándo esperan que esté reparada?',
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        system: false
      },
      {
        id: '4',
        reportId: '1',
        sender: 'city',
        text: 'Esperamos que la reparación se complete en 2-3 días hábiles.',
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        system: false
      }
    ]
  },
  {
    id: '2',
    userId: '1',
    title: 'Bache en la Rue de la Paix',
    description: 'Bache grande que causa daños a vehículos. Muy peligroso para ciclistas.',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800',
    location: {
      lat: 48.8606,
      lng: 2.3376,
      address: '45 Rue de la Paix, París 75002'
    },
    status: 'submitted',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: '5',
        reportId: '2',
        sender: 'city',
        text: 'Hemos recibido su solicitud. Nuestro equipo la revisará pronto.',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        system: true
      }
    ]
  },
  {
    id: '3',
    userId: '1',
    title: 'Grafiti en edificio público',
    description: 'Grafiti ofensivo en el costado del edificio de la biblioteca necesita ser removido.',
    photoUrl: 'https://images.unsplash.com/photo-1558470598-a5dda9640f68?w=800',
    location: {
      lat: 48.8584,
      lng: 2.2945,
      address: '789 Avenue des Champs, París 75008'
    },
    status: 'resolved',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    messages: [
      {
        id: '6',
        reportId: '3',
        sender: 'city',
        text: 'Hemos recibido su solicitud. Nuestro equipo la revisará pronto.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        system: true
      },
      {
        id: '7',
        reportId: '3',
        sender: 'city',
        text: 'Nuestro equipo de limpieza ha sido enviado para remover el grafiti.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        system: false
      },
      {
        id: '8',
        reportId: '3',
        sender: 'city',
        text: 'El grafiti ha sido removido exitosamente. Gracias por reportar este problema.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        system: false
      },
      {
        id: '9',
        reportId: '3',
        sender: 'user',
        text: '¡Excelente trabajo! Gracias por la rápida acción.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        system: false
      }
    ]
  }
];

// Mock users
const MOCK_USERS: Record<string, { user: User; password: string }> = {
  'user@example.com': {
    user: {
      id: '1',
      email: 'user@example.com',
      name: 'María García',
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
      throw new Error('Correo electrónico o contraseña inválidos');
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
    if (!report) throw new Error('Reporte no encontrado');
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
      text: 'Hemos recibido su solicitud. Nuestro equipo la revisará pronto.',
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
    if (!report) throw new Error('Reporte no encontrado');
    return report.messages;
  },

  async sendMessage(input: SendMessageInput, _userId: string): Promise<Message> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const report = reports.find((r) => r.id === input.reportId);
    if (!report) throw new Error('Reporte no encontrado');

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
