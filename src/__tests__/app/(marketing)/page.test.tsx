import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '@/app/(marketing)/page';

// Mock child components to isolate the test to the Home page
jest.mock('@/components/landing/hero', () => ({
  Hero: () => <div data-testid="hero">Hero Component</div>,
}));
jest.mock('@/components/landing/features', () => ({
  Features: () => <div data-testid="features">Features Component</div>,
}));
jest.mock('@/components/landing/personalized-ai', () => ({
    PersonalizedAi: () => <div data-testid="personalized-ai">PersonalizedAi Component</div>,
}));
jest.mock('@/components/landing/example-articles', () => ({
    ExampleArticles: () => <div data-testid="example-articles">ExampleArticles Component</div>,
}));
jest.mock('@/components/landing/comparison', () => ({
    Comparison: () => <div data-testid="comparison">Comparison Component</div>,
}));
jest.mock('@/components/landing/pricing', () => ({
    Pricing: () => <div data-testid="pricing">Pricing Component</div>,
}));
jest.mock('@components/landing/faq', () => ({
    Faq: () => <div data-testid="faq">Faq Component</div>,
}));
jest.mock('@/components/landing/final-cta', () => ({
    FinalCta: () => <div data-testid="final-cta">FinalCta Component</div>,
}));


describe('Home (Landing Page)', () => {
  it('renders the main sections', () => {
    render(<Home />);

    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('features')).toBeInTheDocument();
    expect(screen.getByTestId('personalized-ai')).toBeInTheDocument();
    expect(screen.getByTestId('example-articles')).toBeInTheDocument();
    expect(screen.getByTestId('comparison')).toBeInTheDocument();
    expect(screen.getByTestId('pricing')).toBeInTheDocument();
    expect(screen.getByTestId('faq')).toBeInTheDocument();
    expect(screen.getByTestId('final-cta')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  })
});
