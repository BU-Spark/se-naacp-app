import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import CSVUploadBox from './CSVUploadPage';
import { UploadContext } from "../../contexts/upload_context";
import { useAuth, useUser, useOrganization } from '@clerk/clerk-react';

// Mock Clerk hooks with jest.fn() to enable use of mockReturnValue
jest.mock('@clerk/clerk-react', () => ({
  useUser: jest.fn(),
  useOrganization: jest.fn(),
  useAuth: jest.fn()
}));

const mockUploadData = {
  uploadData: null,
  queryUploadDataType: jest.fn(),
  addRssFeed: jest.fn()
};

// Define wrapper component to include BrowserRouter and UploadContext
const Wrapper: React.FC<{ children: React.ReactNode, hasPermission: boolean }> = ({ children, hasPermission }) => {
  // Mock the return values inside the component to control test conditions
  (useAuth as jest.Mock).mockReturnValue({
    has: jest.fn().mockReturnValue(hasPermission)
  });
  (useUser as jest.Mock).mockReturnValue({
    user: { id: 'user1' }
  });
  (useOrganization as jest.Mock).mockReturnValue({
    organization: { id: 'org1' }
  });

  return (
    <BrowserRouter>
      <UploadContext.Provider value={mockUploadData}>
        {children}
      </UploadContext.Provider>
    </BrowserRouter>
  );
};

describe('CSVUploadPage Permissions', () => {
  it('should show permission denied message when user does not have permissions', () => {
    render(<Wrapper hasPermission={false}><CSVUploadBox /></Wrapper>);
    expect(screen.getByText(/You do not have permission to access this page./)).toBeInTheDocument();
  });

  it('should render upload interface when user has permissions', () => {
    render(<Wrapper hasPermission={true}><CSVUploadBox /></Wrapper>);
    expect(screen.getByText(/Upload a CSV File/)).toBeInTheDocument();
  });
});
