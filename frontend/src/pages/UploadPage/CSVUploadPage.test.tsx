import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import CSVUploadBox from './CSVUploadPage';
import { UploadContext } from "../../contexts/upload_context";
import { useAuth, useUser, useOrganization } from '@clerk/clerk-react';
import { MockedProvider } from '@apollo/client/testing';


// Mock Clerk hooks with jest.fn() to enable use of mockReturnValue
jest.mock('@clerk/clerk-react', () => ({
  useUser: jest.fn(),
  useOrganization: jest.fn(),
  useAuth: jest.fn()
}));

const mockUploadData = {
  uploadData: null,
  queryUploadDataType: jest.fn(),
  addRssFeed: jest.fn(),
  uploadCSV: jest.fn()  
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
    <MockedProvider mocks={[]} addTypename={false}>
      <UploadContext.Provider value={mockUploadData}>
        {children}
      </UploadContext.Provider>
    </MockedProvider>
  </BrowserRouter>
);
};

describe('CSVUploadPage Permissions', () => {

  //Test 1 to check that if users have not permission they cannot access the uploading page
  it('should show permission denied message when user does not have permissions', () => {
    render(<Wrapper hasPermission={false}><CSVUploadBox /></Wrapper>);
    expect(screen.getByText(/You do not have permission to access this page./)).toBeInTheDocument();
  });

  //Test 2 to check that if users have permission they can access the uploading page
  it('should render upload interface when user has permissions', () => {
    render(<Wrapper hasPermission={true}><CSVUploadBox /></Wrapper>);
    expect(screen.getByText(/Upload a CSV File/)).toBeInTheDocument();
  });

  //Test 3 to check the uploading process 
  it('should handle file upload process correctly', async () => {
    render(<Wrapper hasPermission={true}><CSVUploadBox /></Wrapper>);
  
    const file = new File([`Headline,Publisher,Byline,content_id,Paths,Publish Date,Body
      Test Headline,Test Publisher,Test Byline,12345,/test-path,2021-01-01,Test Body`], 'test.csv', { type: 'text/csv' });
    
  
    const input = screen.getByLabelText(/Click to upload/i);
    
    // Simulate file selection
    fireEvent.change(input, { target: { files: [file] } });
  
    // Verify the file appears in the upload list
    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });
  
    // Verify the upload status
    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  
    // Simulate the file upload completion
    await waitFor(() => {
      expect(screen.getByText('Passed')).toBeInTheDocument();
    });
  });
  
});
