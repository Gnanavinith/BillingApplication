import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import connectDB from './config/db.js'
import User from './models/User.js'

dotenv.config()

async function seedUsers() {
  try {
    await connectDB()

    await User.deleteMany()

    const users = [
      { name: 'Admin User', email: 'admin@gmail.com', password: await bcrypt.hash('123456', 10), role: 'admin' },
      { name: 'Manager User', email: 'manager@gmail.com', password: await bcrypt.hash('123456', 10), role: 'manager' },
      { name: 'Staff User', email: 'staff@gmail.com', password: await bcrypt.hash('123456', 10), role: 'staff' },
    ]

    await User.insertMany(users)
    console.log('✅ Default users added successfully!')
    console.log(`\n───────────────────────────────\nAdmin:   admin@gmail.com / 123456\nManager: manager@gmail.com / 123456\nStaff:   staff@gmail.com / 123456\n───────────────────────────────\n`)
    await mongoose.connection.close()
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding error:', err.message)
    process.exit(1)
  }
}

seedUsers()


