import mongoose from 'mongoose';
import { ENV } from './lib/env.js';
import { User } from './models/User.js';

const seedUsers = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create admin users
    const adminUsers = [
      {
        email: 'admin1@umaclasses.com',
        name: 'Admin One',
        role: 'admin',
        googleId: null
      },
      {
        email: 'admin2@umaclasses.com',
        name: 'Admin Two',
        role: 'admin',
        googleId: null
      }
    ];

    // Create student users
    const studentUsers = [
      {
        email: 'student1@umaclasses.com',
        name: 'Student One',
        role: 'student',
        googleId: null
      },
      {
        email: 'student2@umaclasses.com',
        name: 'Student Two',
        role: 'student',
        googleId: null
      }
    ];

    const allUsers = [...adminUsers, ...studentUsers];
    await User.insertMany(allUsers);

    console.log('✅ Seeded 4 users successfully:');
    console.log('Admins:');
    console.log('  - admin1@umaclasses.com');
    console.log('  - admin2@umaclasses.com');
    console.log('Students:');
    console.log('  - student1@umaclasses.com');
    console.log('  - student2@umaclasses.com');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    process.exit(1);
  }
};

seedUsers();
