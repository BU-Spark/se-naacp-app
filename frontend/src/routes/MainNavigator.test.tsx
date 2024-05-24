jest.mock('react-lottie-player', () => () => <div>Mocked Lottie Player</div>); 
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider, useAuth, useUser, useOrganization } from '@clerk/clerk-react';
import MainNavigator, { NoAccessPage } from './MainNavigator';
import { ClerkProviderNavigate } from "../config/ClerkProvider";
import '@testing-library/jest-dom/extend-expect';

// Mock the Clerk hooks
jest.mock('@clerk/clerk-react', () => ({
  ...jest.requireActual('@clerk/clerk-react'),
  useUser: jest.fn(),
  useOrganization: jest.fn(),
  useAuth: jest.fn()
}));

// Mock the ClerkProviderNavigate component inline
jest.mock('../config/ClerkProvider', () => {
  return {
    __esModule: true,
    ClerkProviderNavigate: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Define wrapper component to include all necessary providers
const Wrapper: React.FC<{ hasPermission: boolean }> = ({ hasPermission }) => {
  // Mock the return values inside the component to control test conditions
  (useAuth as jest.Mock).mockReturnValue({
    has: jest.fn().mockReturnValue(hasPermission)
  });
  (useUser as jest.Mock).mockReturnValue({
    user: {
      organizationMemberships: [
        { organization: { id: 'org-123' } }
      ]
    }
  });
  (useOrganization as jest.Mock).mockReturnValue({ organization: { id: 'org-123' } });

  return (
    <>
      <MainNavigator />
    </>
  );
};

describe('MainNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
//Test 1 to check that users that are not part of an org, they cannot access our app
  it('should redirect to NoAccessPage if user is not part of an organization', () => {
    (useUser as jest.Mock).mockReturnValue({ user: { organizationMemberships: [] } });
    (useOrganization as jest.Mock).mockReturnValue({ organization: { id: 'org-123' } });

    render(
      <BrowserRouter>
        <ClerkProviderNavigate>
          <NoAccessPage />
        </ClerkProviderNavigate>
      </BrowserRouter>
    );

    expect(screen.getByText(/You do not have permission to access this page./)).toBeInTheDocument();
    expect(screen.getByText(/Please contact the administrator./)).toBeInTheDocument();
  });
});
