require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');

const sampleDestinations = [
  {
    title: "Goa Beach Retreat",
    location: "Goa, India",
    description: "Sun, sand, and vibrant nightlife on the pristine beaches of Goa.",
    category: "Beach",
    price: 15000,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Andaman Island Escape",
    location: "Andaman & Nicobar",
    description: "Crystal clear turquoise waters, white sandy beaches, and vibrant coral reefs.",
    category: "Beach",
    price: 22000,
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Gokarna Coastal Haven",
    location: "Karnataka, India",
    description: "Relaxed temple town featuring pristine beaches and peaceful cliffside views.",
    category: "Beach",
    price: 11000,
    image: "https://web-cms.karnatakatourism.org/wp-content/uploads/2026/05/kudle-9157.jpg-scaled.jpeg"
  },
  {
    title: "Manali Mountain Escape",
    location: "Himachal Pradesh, India",
    description: "Breathtaking snow-capped peaks, pine forests, and adventure sports.",
    category: "Mountains",
    price: 18000,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Leh Ladakh Expedition",
    location: "Ladakh, India",
    description: "Rugged high-altitude desert landscapes, winding mountain roads, and majestic passes.",
    category: "Mountains",
    price: 25000,
    image: "https://images.unsplash.com/photo-1581793745862-99fce1891729?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Darjeeling Tea Hills",
    location: "West Bengal, India",
    description: "Rolling green tea gardens with panoramic views of the magnificent Kanchenjunga.",
    category: "Mountains",
    price: 14000,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Jaipur Royal Heritage",
    location: "Rajasthan, India",
    description: "Explore majestic palaces, historic forts, and rich Rajasthani culture.",
    category: "Heritage",
    price: 12000,
    image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Agra Monument of Love",
    location: "Uttar Pradesh, India",
    description: "Discover world-renowned Mughal architecture, including the breathtaking Taj Mahal.",
    category: "Heritage",
    price: 10000,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Varanasi Spiritual Journey",
    location: "Uttar Pradesh, India",
    description: "Experience ancient traditions, holy ghats, and mesmerizing evening rituals by the Ganges.",
    category: "Heritage",
    price: 9000,
    image: "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Kerala Backwater Cruise",
    location: "Kerala, India",
    description: "Peaceful houseboat cruises through tranquil palm-fringed backwaters and lush greenery.",
    category: "Nature",
    price: 20000,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Munnar Hillside Paradise",
    location: "Kerala, India",
    description: "Mist-covered hills, cascading waterfalls, and sprawling endless green plantations.",
    category: "Nature",
    price: 13000,
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Jim Corbett Wildlife Safari",
    location: "Uttarakhand, India",
    description: "Thrilling jungle safaris in India's oldest national park amidst diverse flora and fauna.",
    category: "Nature",
    price: 16000,
    image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Destination.deleteMany({});
    console.log("Cleared existing destinations.");

    await Destination.insertMany(sampleDestinations);
    console.log("Successfully seeded sample destinations!");

    mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (err) {
    console.error("Error seeding database:", err);
    mongoose.connection.close();
  }
};

seedDB();