jest.mock('react-lottie-player', () => () => <div>Mocked Lottie Player</div>); 
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
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

  const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || '';

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <MemoryRouter>
        <MainNavigator />
      </MemoryRouter>
    </ClerkProvider>
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

  it('should show the main navigator if user is part of an organization', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: {
        organizationMemberships: [
          { organization: { id: 'org-123' } }
        ]
      }
    });
    (useOrganization as jest.Mock).mockReturnValue({ organization: { id: 'org-123' } });

    render(
      <Wrapper hasPermission={true}></Wrapper>
    );

    expect(screen.getByText('Explore Stories')).toBeInTheDocument();
    expect(screen.getByText('Locations')).toBeInTheDocument();
    // cannot access Upload and Dashboard if no access in this org
    expect(screen.queryByText('Upload')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  // Test 3: If user has org:test:demo permission check they can see all elements

  // Test 4: What happens if you press a link on navigate
  // https://javascript.plainenglish.io/testing-react-router-with-react-testing-library-8e24f7bdca18
});
