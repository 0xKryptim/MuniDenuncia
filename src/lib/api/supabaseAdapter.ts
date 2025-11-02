import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { DataAdapter } from './adapter';
import type { User, Report, Message, LoginCredentials, AuthResponse, CreateReportInput, SendMessageInput } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabaseAdapter: DataAdapter = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No user returned');

    const user: User = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name,
      avatarUrl: data.user.user_metadata?.avatar_url,
    };

    return { user, token: data.session?.access_token };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    return {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.user_metadata?.name,
      avatarUrl: session.user.user_metadata?.avatar_url,
    };
  },

  async getReports(userId: string): Promise<Report[]> {
    const { data: reportsData, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (reportsError) throw new Error(reportsError.message);

    // Fetch messages for each report
    const reports: Report[] = await Promise.all(
      (reportsData || []).map(async (report) => {
        const { data: messagesData } = await supabase
          .from('messages')
          .select('*')
          .eq('report_id', report.id)
          .order('created_at', { ascending: true });

        return {
          id: report.id,
          userId: report.user_id,
          title: report.title,
          description: report.description,
          photoUrl: report.photo_url,
          location: report.location,
          status: report.status,
          createdAt: report.created_at,
          updatedAt: report.updated_at,
          messages: (messagesData || []).map((msg) => ({
            id: msg.id,
            reportId: msg.report_id,
            sender: msg.sender,
            text: msg.text,
            createdAt: msg.created_at,
            system: msg.system,
          })),
        };
      })
    );

    return reports;
  },

  async getReport(id: string): Promise<Report> {
    const { data: reportData, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (reportError) throw new Error(reportError.message);

    const { data: messagesData } = await supabase
      .from('messages')
      .select('*')
      .eq('report_id', id)
      .order('created_at', { ascending: true });

    return {
      id: reportData.id,
      userId: reportData.user_id,
      title: reportData.title,
      description: reportData.description,
      photoUrl: reportData.photo_url,
      location: reportData.location,
      status: reportData.status,
      createdAt: reportData.created_at,
      updatedAt: reportData.updated_at,
      messages: (messagesData || []).map((msg) => ({
        id: msg.id,
        reportId: msg.report_id,
        sender: msg.sender,
        text: msg.text,
        createdAt: msg.created_at,
        system: msg.system,
      })),
    };
  },

  async uploadPhoto(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('report-photos')
      .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage
      .from('report-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async createReport(input: CreateReportInput, userId: string): Promise<Report> {
    const photoUrl = await supabaseAdapter.uploadPhoto(input.photoFile);

    const { data: reportData, error: reportError } = await supabase
      .from('reports')
      .insert({
        user_id: userId,
        title: input.title,
        description: input.description,
        photo_url: photoUrl,
        location: input.location,
        status: 'submitted',
      })
      .select()
      .single();

    if (reportError) throw new Error(reportError.message);

    // Create system message
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        report_id: reportData.id,
        sender: 'city',
        text: 'We have received your request. Our team will review it shortly.',
        system: true,
      })
      .select()
      .single();

    if (messageError) throw new Error(messageError.message);

    return {
      id: reportData.id,
      userId: reportData.user_id,
      title: reportData.title,
      description: reportData.description,
      photoUrl: reportData.photo_url,
      location: reportData.location,
      status: reportData.status,
      createdAt: reportData.created_at,
      updatedAt: reportData.updated_at,
      messages: [{
        id: messageData.id,
        reportId: messageData.report_id,
        sender: messageData.sender,
        text: messageData.text,
        createdAt: messageData.created_at,
        system: messageData.system,
      }],
    };
  },

  async getMessages(reportId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);

    return (data || []).map((msg) => ({
      id: msg.id,
      reportId: msg.report_id,
      sender: msg.sender,
      text: msg.text,
      createdAt: msg.created_at,
      system: msg.system,
    }));
  },

  async sendMessage(input: SendMessageInput, userId: string): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        report_id: input.reportId,
        sender: 'user',
        text: input.text,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      reportId: data.report_id,
      sender: data.sender,
      text: data.text,
      createdAt: data.created_at,
      system: data.system,
    };
  },

  subscribeToMessages(reportId: string, callback: (message: Message) => void) {
    const channel = supabase
      .channel(`messages:${reportId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `report_id=eq.${reportId}`,
        },
        (payload) => {
          const msg = payload.new as any;
          callback({
            id: msg.id,
            reportId: msg.report_id,
            sender: msg.sender,
            text: msg.text,
            createdAt: msg.created_at,
            system: msg.system,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
