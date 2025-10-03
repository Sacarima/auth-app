import mongoose from 'mongoose';

export async function connectDB(mongoUri) {
  mongoose.set('sanitizeFilter', true);
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
  const { host, name } = mongoose.connection;
  console.log(`[db] Connected to Mongo @ ${host}/${name}`);
}
