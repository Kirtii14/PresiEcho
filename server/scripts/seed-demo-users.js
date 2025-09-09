require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const users = [
  { name: "Alina", email: "alina@presi.edu", password: "Password123!" },
  { name: "Alice", email: "alice@presi.edu", password: "Password123!" },
  { name: "Daisy", email: "daisy@presi.edu", password: "Password123!" },
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    for (const user of users) {
      const exists = await User.findOne({ email: user.email });
      if (exists) {
        console.log(`Skipping existing user: ${user.email}`);
        continue;
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await User.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: "general",
        isEmailVerified: true,
        avatar:
          "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg",
      });
      console.log(`Seeded user: ${user.email}`);
    }

    console.log("Seeding complete.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

