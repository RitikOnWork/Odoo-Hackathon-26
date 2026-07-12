import { MongoMemoryReplSet } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';

async function startMongo() {
  console.log('⏳ Starting in-memory MongoDB Replica Set...');
  try {
    const replSet = await MongoMemoryReplSet.create({
      replSet: {
        dbName: 'transitops',
        storageEngine: 'wiredTiger',
      },
      instanceOpts: [
        {
          port: 27017,
        }
      ]
    });
    const uri = replSet.getUri();
    console.log(`✅ In-memory MongoDB Replica Set is running at: ${uri}`);

    // Update .env file with the connection string
    const envPath = path.resolve(__dirname, '../../.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    if (envContent.includes('MONGO_URI=')) {
      envContent = envContent.replace(/MONGO_URI=.*/, `MONGO_URI=${uri}`);
    } else {
      envContent += `\nMONGO_URI=${uri}\n`;
    }

    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('📝 Updated .env with the new MONGO_URI.');

    // Keep process alive
    process.on('SIGINT', async () => {
      console.log('Stopping MongoDB Memory Replica Set...');
      await replSet.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to start In-Memory MongoDB Replica Set:', error);
    process.exit(1);
  }
}

startMongo();
