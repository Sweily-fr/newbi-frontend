declare module 'apollo-upload-client' {
  import { ApolloLink } from '@apollo/client';
  
  export interface CreateUploadLinkOptions {
    uri: string;
    headers?: Record<string, string>;
    credentials?: string;
    fetch?: any;
    fetchOptions?: any;
    includeExtensions?: boolean;
  }
  
  export function createUploadLink(options: CreateUploadLinkOptions): ApolloLink;
}
