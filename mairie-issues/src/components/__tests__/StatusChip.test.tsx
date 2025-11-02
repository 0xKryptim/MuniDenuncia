import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusChip } from '@/components/reports/StatusChip';

describe('StatusChip Component', () => {
  describe('rendering each status type', () => {
    it('should render submitted status', () => {
      render(<StatusChip status="submitted" />);
      expect(screen.getByText('Submitted')).toBeInTheDocument();
    });

    it('should render in_review status', () => {
      render(<StatusChip status="in_review" />);
      expect(screen.getByText('In Review')).toBeInTheDocument();
    });

    it('should render in_progress status', () => {
      render(<StatusChip status="in_progress" />);
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    it('should render resolved status', () => {
      render(<StatusChip status="resolved" />);
      expect(screen.getByText('Resolved')).toBeInTheDocument();
    });

    it('should render rejected status', () => {
      render(<StatusChip status="rejected" />);
      expect(screen.getByText('Rejected')).toBeInTheDocument();
    });
  });

  describe('color and variant mapping', () => {
    it('should have secondary variant for submitted status', () => {
      const { container } = render(<StatusChip status="submitted" />);
      const badge = container.querySelector('[class*="bg-slate"]');
      expect(badge).toBeInTheDocument();
    });

    it('should have outline variant for in_review status', () => {
      const { container } = render(<StatusChip status="in_review" />);
      const badge = container.querySelector('[class*="bg-amber"]');
      expect(badge).toBeInTheDocument();
    });

    it('should have outline variant for in_progress status', () => {
      const { container } = render(<StatusChip status="in_progress" />);
      const badge = container.querySelector('[class*="bg-blue"]');
      expect(badge).toBeInTheDocument();
    });

    it('should have outline variant for resolved status', () => {
      const { container } = render(<StatusChip status="resolved" />);
      const badge = container.querySelector('[class*="bg-green"]');
      expect(badge).toBeInTheDocument();
    });

    it('should have destructive variant for rejected status', () => {
      const { container } = render(<StatusChip status="rejected" />);
      const badge = container.querySelector('[class*="bg-red"]');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('custom className prop', () => {
    it('should apply custom className to the badge', () => {
      const { container } = render(
        <StatusChip status="submitted" className="custom-class" />
      );
      const badge = container.firstChild;
      expect(badge).toHaveClass('custom-class');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(
        <StatusChip status="in_progress" className="mt-4" />
      );
      const badge = container.firstChild;
      expect(badge).toHaveClass('mt-4');
      expect(badge).toHaveClass('px-2.5');
      expect(badge).toHaveClass('py-0.5');
    });
  });
});
