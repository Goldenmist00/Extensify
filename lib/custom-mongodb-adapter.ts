import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from './mongodb';

export function CustomMongoDBAdapter() {
  const adapter = MongoDBAdapter(clientPromise);

  return {
    ...adapter,
    async createUser(data: any) {
      try {
        const client = await clientPromise;
        const users = client.db('Extensify').collection('users');

        // Check if user already exists with same email
        const existingUser = await users.findOne({ email: (data.email || '').toLowerCase() });

        if (existingUser) {
          console.log('User already exists, linking accounts:', data.email);
          return existingUser;
        }

        // Create new user
        return await adapter.createUser!({ ...data, email: (data.email || '').toLowerCase() });
      } catch (error) {
        console.error('Error in custom createUser:', error);
        return await adapter.createUser!(data);
      }
    },

    async linkAccount(data: any) {
      try {
        const client = await clientPromise;
        const users = client.db('Extensify').collection('users');

        // Check if account already exists
        const existingAccount = await users.findOne({
          'accounts.provider': data.provider,
          'accounts.providerAccountId': data.providerAccountId,
        });

        if (existingAccount) {
          console.log('Account already linked:', data.providerAccountId);
          return existingAccount;
        }

        // Link account
        return await adapter.linkAccount!(data);
      } catch (error) {
        console.error('Error in custom linkAccount:', error);
        return await adapter.linkAccount!(data);
      }
    },
  };
}
