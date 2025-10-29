'use client';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/landing/header';
import { useUser } from '@/firebase';

// Mock the useUser hook
jest.mock('@/firebase', () => ({
  useUser: jest.fn(),
}));

// Mock the Logo component
jest.mock('@/components/logo', () => ({
    Logo: () => <div data-testid="logo">AudioScribe</div>
}));

describe('Header Component', () => {
  const mockUseUser = useUser as jest.Mock;

  describe('when user is logged out', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({ user: null, isUserLoading: false });
    });

    it('renders navigation links', () => {
      render(<Header />);
      expect(screen.getByText('How it Works')).toBeInTheDocument();
      expect(screen.getByText('Pricing')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
    });

    it('renders Login and Start For Free buttons', () => {
      render(<Header />);
      expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Start For Free/i })).toBeInTheDocument();
    });

    it('does not render Dashboard button', () => {
        render(<Header />);
        expect(screen.queryByRole('link', { name: /Dashboard/i })).not.toBeInTheDocument();
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({ user: { uid: '123' }, isUserLoading: false });
    });

    it('renders navigation links', () => {
        render(<Header />);
        expect(screen.getByText('How it Works')).toBeInTheDocument();
        expect(screen.getByText('Pricing')).toBeInTheDocument();
        expect(screen.getByText('Blog')).toBeInTheDocument();
    });

    it('renders Dashboard button', () => {
      render(<Header />);
      expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
    });

    it('does not render Login and Start For Free buttons', () => {
      render(<Header />);
      expect(screen.queryByRole('link', { name: /Login/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /Start For Free/i })).not.toBeInTheDocument();
    });
  });

  describe('when auth state is loading', () => {
     beforeEach(() => {
      mockUseUser.mockReturnValue({ user: null, isUserLoading: true });
    });

    it('renders a loading button', () => {
        render(<Header />);
        expect(screen.getByRole('button', { name: /Loading.../i })).toBeInTheDocument();
    });
  });
});
