import { Adapter } from 'next-auth/adapters';
import { MongoClient, ObjectId } from 'mongodb';
import clientPromise from './mongodb';

export function CustomExtensifyAdapter(): Adapter {
  return {
    async createUser(data) {
      const client = await clientPromise;
      const db = client.db('Extensify');

      // Check if user already exists (for account linking scenarios)
      const existingUser = await db
        .collection('users')
        .findOne({ email: (data.email || '').toLowerCase() });
      if (existingUser) {
        console.log(
          'User already exists, returning existing user:',
          data.email
        );
        return { ...existingUser, id: existingUser._id.toString() };
      }

      const user = {
        _id: new ObjectId(),
        email: (data.email || '').toLowerCase(),
        name: data.name,
        image: data.image,
        emailVerified: data.emailVerified,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Additional user data structure
        profile: {
          avatar: data.image || '',
          bio: '',
          website: '',
        },
        extensions: [],
        settings: {
          theme: 'light',
          notifications: true,
        },
        stats: {
          totalExtensions: 0,
          publishedExtensions: 0,
          totalDownloads: 0,
        },
      };

      await db.collection('users').insertOne(user);
      console.log('Created new user in Extensify database:', data.email);
      return { ...user, id: user._id.toString() };
    },

    async getUser(id) {
      const client = await clientPromise;
      const db = client.db('Extensify');
      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(id) });
      if (!user) return null;
      return { ...user, id: user._id.toString() };
    },

    async getUserByEmail(email) {
      const client = await clientPromise;
      const db = client.db('Extensify');
      const user = await db
        .collection('users')
        .findOne({ email: (email || '').toLowerCase() });
      if (!user) return null;
      return { ...user, id: user._id.toString() };
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const client = await clientPromise;
      const db = client.db('Extensify');
      const account = await db.collection('accounts').findOne({
        provider,
        providerAccountId,
      });
      if (!account) return null;

      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(account.userId) });
      if (!user) return null;
      return { ...user, id: user._id.toString() };
    },

    async updateUser(user) {
      const client = await clientPromise;
      const db = client.db('Extensify');
      const { id, ...data } = user;
      const result = await db
        .collection('users')
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...data, updatedAt: new Date() } }
        );
      if (result.matchedCount === 0) throw new Error('User not found');
      return user;
    },

    async deleteUser(userId) {
      const client = await clientPromise;
      const db = client.db('Extensify');
      await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
      await db.collection('accounts').deleteMany({ userId });
      await db.collection('sessions').deleteMany({ userId });
    },

    async linkAccount(data) {
      const client = await clientPromise;
      const db = client.db('Extensify');
      const account = {
        _id: new ObjectId(),
        userId: data.userId,
        type: data.type,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        refresh_token: data.refresh_token,
        access_token: data.access_token,
        expires_at: data.expires_at,
        token_type: data.token_type,
        scope: data.scope,
        id_token: data.id_token,
        session_state: data.session_state,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('accounts').insertOne(account);
      return { ...account, id: account._id.toString() };
    },

    async unlinkAccount({ provider, providerAccountId }) {
      const client = await clientPromise;
      const db = client.db('Extensify');
      await db.collection('accounts').deleteOne({
        provider,
        providerAccountId,
      });
    },

    async createSession(data) {
      const client = await clientPromise;
      const db = client.db('Extensify');
      const session = {
        _id: new ObjectId(),
        userId: data.userId,
        sessionToken: data.sessionToken,
        expires: data.expires,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('sessions').insertOne(session);
      return { ...session, id: session._id.toString() };
    },

    async getSessionAndUser(sessionToken) {
      const client = await clientPromise;
      const db = client.db('Extensify');
      const session = await db.collection('sessions').findOne({ sessionToken });
      if (!session) return null;

      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(session.userId) });
      if (!user) return null;

      return {
        session: { ...session, id: session._id.toString() },
        user: { ...user, id: user._id.toString() },
      };
    },

    async updateSession(data) {
      const client = await clientPromise;
      const db = client.db('Extensify');
      const { sessionToken, ...updateData } = data;
      const result = await db
        .collection('sessions')
        .updateOne(
          { sessionToken },
          { $set: { ...updateData, updatedAt: new Date() } }
        );
      if (result.matchedCount === 0) return null;

      const session = await db.collection('sessions').findOne({ sessionToken });
      return { ...session, id: session._id.toString() };
    },

    async deleteSession(sessionToken) {
      const client = await clientPromise;
      const db = client.db('Extensify');
      await db.collection('sessions').deleteOne({ sessionToken });
    },

    async createVerificationToken(data) {
      const client = await clientPromise;
      const db = client.db('Extensify');
      const verificationToken = {
        _id: new ObjectId(),
        identifier: data.identifier,
        token: data.token,
        expires: data.expires,
        createdAt: new Date(),
      };

      await db.collection('verification_tokens').insertOne(verificationToken);
      return { ...verificationToken, id: verificationToken._id.toString() };
    },

    async useVerificationToken({ identifier, token }) {
      const client = await clientPromise;
      const db = client.db('Extensify');
      const verificationToken = await db
        .collection('verification_tokens')
        .findOne({
          identifier,
          token,
        });
      if (!verificationToken) return null;

      await db.collection('verification_tokens').deleteOne({
        identifier,
        token,
      });

      return { ...verificationToken, id: verificationToken._id.toString() };
    },
  };
}
