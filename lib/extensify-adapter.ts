import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from './mongodb';

export function ExtensifyMongoDBAdapter() {
  const adapter = MongoDBAdapter(clientPromise, {
    databaseName: 'Extensify',
    collections: {
      Users: 'users',
      Accounts: 'accounts',
      Sessions: 'sessions',
      VerificationTokens: 'verification_tokens',
    },
  });

  return adapter;
}
