import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import type { User } from '@/lib/types';

// Mock the api module
vi.mock('@/lib/api', () => ({
  api: {
    getCurrentUser: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    // Clear the store state before each test
    useAuthStore.setState({
      user: null,
      isLoading: true,
      isAuthenticated: false,
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have user as null', () => {
      const { result } = renderHook(() => useAuthStore());
      expect(result.current.user).toBeNull();
    });

    it('should have isLoading as true', () => {
      const { result } = renderHook(() => useAuthStore());
      expect(result.current.isLoading).toBe(true);
    });

    it('should have isAuthenticated as false', () => {
      const { result } = renderHook(() => useAuthStore());
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('should set user and isAuthenticated to true on successful login', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      vi.mocked(api.login).mockResolvedValueOnce({
        user: mockUser,
        token: 'mock-token',
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should call api.login with correct credentials', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
      };

      vi.mocked(api.login).mockResolvedValueOnce({
        user: mockUser,
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect(api.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('logout', () => {
    it('should clear user and set isAuthenticated to false', async () => {
      // Set initial authenticated state
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
      };

      useAuthStore.setState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });

      vi.mocked(api.logout).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should call api.logout', async () => {
      vi.mocked(api.logout).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.logout();
      });

      expect(api.logout).toHaveBeenCalled();
    });
  });

  describe('initialize', () => {
    it('should fetch current user and set authenticated state', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
      };

      vi.mocked(api.getCurrentUser).mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('should set isLoading to false on error', async () => {
      vi.mocked(api.getCurrentUser).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle undefined user response', async () => {
      vi.mocked(api.getCurrentUser).mockResolvedValueOnce(undefined as any);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.initialize();
      });

      expect(result.current.user).toBeUndefined();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
