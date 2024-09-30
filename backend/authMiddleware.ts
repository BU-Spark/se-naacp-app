import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Define the authentication middleware function
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Retrieve the public key from environment variables
  const publicKey = process.env.CLERK_PEM_PUBLIC_KEY;
  if (!publicKey) {
    console.error("CLERK_PEM_PUBLIC_KEY is not set in the environment variables");
    return res.status(500).json({ message: "Internal Server Error" });
  }

  // Extract the token and organization token from request headers
  const token = req.headers.authorization?.split('Bearer ')[1];
  const orgToken = req.headers['x-org-token'];

  // Check if token or organization token is missing
  if (!token || !orgToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the authentication token using the public key
    const decodedAuthToken: any = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    if (!decodedAuthToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Decode the org token without verifying it
    const decodedOrgToken: any = jwt.decode(orgToken);
    if (!decodedOrgToken) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Check if the user is part of the required organization
    const userOrgs = decodedOrgToken.orgs; // Assuming `orgs` contains the user's organization IDs
    const allowedOrgs = ["org_2bHDzl2Zax0nILIzDhui2DLWdH6", "org_2ZN4MA41LAA9l4j0rZBC5Olsr3Y"];
    if (!allowedOrgs.includes(userOrgs)) {
      return res.status(403).json({ message: "Forbidden: Not part of the organization" });
    }

    // Store the decoded token in the request headers
    req.headers.user = JSON.stringify(decodedAuthToken); // Store the decoded token in the request headers
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).json({ message: "Unauthorized: Invalid token" });
  }
};
