// This middleware handles authentication for protected routes
// It checks if the user is logged in and has a valid token
// Import necessary modules and dependencies
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
// Define the authentication middleware function
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Retrieve the public key from environment variables
  const publicKey = process.env.CLERK_PEM_PUBLIC_KEY;
  if (!publicKey) {
    console.error("CLERK_PEM_PUBLIC_KEY is not set in the environment variables");
    throw new Error("Internal Server Error");
  }
  // Extract the token and organization token from request headers
  const token = req.headers['x-org-token'];
  // Swap the values of the `authorization` and `x-org-token` headers
if (req.headers.authorization && req.headers['x-org-token']) {
  // Extract the token value from `x-org-token` and format it as a Bearer token
  const temp = `Bearer ${req.headers['x-org-token']}`;
    // Set `x-org-token` to the original token from the `authorization` header
    req.headers['x-org-token'] = req.headers.authorization.split(' ')[1];
  // Set `authorization` header to the new Bearer token
  req.headers.authorization = temp;


}

  console.log("testing ", req.headers);

  if (!token) {
    const error = new Error("Unauthorized");
    (error as any).code = 401;
    throw error;
  }
  try {
    // Verify the authentication token using the public key
    const decodedAuthToken: any = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    if (!decodedAuthToken) {
      const error = new Error("Unauthorized");
      (error as any).code = 401;
      throw error;
    }

    // Check if the user is part of the required organization
    const userOrgs = decodedAuthToken.orgs
   // console.log("userOrgs",userOrgs)
    const allowedOrgs = ["org_2bHDzl2Zax0nILIzDhui2DLWdH6", "org_2ZN4MA41LAA9l4j0rZBC5Olsr3Y"];
    if (!allowedOrgs.includes(userOrgs)) {
      const error = new Error("Forbidden: Not part of the organization");
      (error as any).code = 403;
      throw error;
    }
    // Store the decoded token in the request headers
    req.headers.user = JSON.stringify(decodedAuthToken); // Store the decoded token in the request headers
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying token:", error);
    if (res && !res.headersSent) {
      return res.status((error as any).code || 403).json({ message: (error as any).message });
    }
  }
};