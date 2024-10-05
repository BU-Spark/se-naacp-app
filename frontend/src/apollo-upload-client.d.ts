declare module 'apollo-upload-client' {
    import { ApolloLink, Operation, FetchResult, Observable } from '@apollo/client/core';
  
    export interface UploadOptions {
      uri?: string;
      fetch?: WindowOrWorkerGlobalScope['fetch'];
      includeExtensions?: boolean;
      credentials?: string;
      headers?: any;
      fetchOptions?: any;
      FormData?: any;
    }
  
    export function createUploadLink(options?: UploadOptions): ApolloLink;
  }
  