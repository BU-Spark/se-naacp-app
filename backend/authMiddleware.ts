// This middleware handles authentication for protected routes
// It checks if the user is logged in and has a valid token
// Import necessary modules and dependencies
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
// Define the authentication middleware function
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("Request Headers:", req.headers);
  const token = req.headers['x-org-token'];
  console.log("Token from headers:", token);


  // Retrieve the public key from environment variables
  const publicKey = process.env.CLERK_PEM_PUBLIC_KEY;
  if (!publicKey) {
    console.error("CLERK_PEM_PUBLIC_KEY is not set in the environment variables");
    throw new Error("Internal Server Error");
  }

  // Extract the token and organization token from request headers
  //const token = req.headers['x-org-token'];
 //const token = 'eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18yWkdwcmlDckozQWM5dmh0OTZJY2VJMDBQT0IiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJleHAiOjE3Mjg1MDk5ODIsImlhdCI6MTcyODQ5MTk4MiwiaXNzIjoiaHR0cHM6Ly9kYXJpbmctY3JheWZpc2gtMjEuY2xlcmsuYWNjb3VudHMuZGV2IiwianRpIjoiMjJlMGE0MzU3YjI2MDIzMjQzOTMiLCJuYmYiOjE3Mjg0OTE5NzcsIm9yZ3MiOiJvcmdfMmJIRHpsMlpheDBuSUxJekRodWkyRExXZEg2Iiwic3ViIjoidXNlcl8ybHllMlI2OVI5T2Z2TW9uRlB3ZXNBVkdKazMifQ.mWTc7_QaWBy2N_T1U0my7Mi2WTLStEwEsL1plrJ3u1d3C_O8sSz3_X9_-L6etqC_qvC_JO_xBIiXRRQN_eBPvU6xrFUk80dE6oJkvMIsKyFKms63Zt7KZVsa41XFUfuixNQo4qd0i87ZaQ37uEEFG6e0O-UjeknEimoeNLPaRnZSw8W8Ea2YA5PVKxvPPR_9oLEoJq-U_WzdLGqZBME3-qjoMIS6DmoTEnr3g68dVk_d9i7mBiCIjeKkU2_PPJaiD30j78CWB-KpONS9Gjxznre8ERbz-gaNXRmdzf0IKMX5kxZChI3eSF5MS-Cn0MN1JT4NS-1h8QbzPSPWca4rVQ';
  //console.log("headers", req.headers)
  //console.log("token", token)
  // const orgToken = req.headers['x-org-token'];
  // Check if token or organization token is missing
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
    console.log("decoded", decodedAuthToken)
    // Check if the user is part of the required organization
    const userOrgs = decodedAuthToken.orgs

    console.log("userOrgs", userOrgs)
   // console.log("userOrgs",userOrgs)
    const allowedOrgs = ["org_2bHDzl2Zax0nILIzDhui2DLWdH6", "org_2ZN4MA41LAA9l4j0rZBC5Olsr3Y"];
    if (!allowedOrgs.includes(userOrgs)) {
      const error = new Error("Forbidden: Not part of the organization");
      (error as any).code = 403;
      throw error;
    }
    // Store the decoded token in the request headers
    req.headers.user = JSON.stringify(decodedAuthToken); // Store the decoded token in the request headers
    console.log("6")
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error verifying token:", error);
    if (res && !res.headersSent) {
      return res.status((error as any).code || 403).json({ message: (error as any).message });
    }
  }
};









