const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Classic White T-Shirt',
    color: 'white',
    price: 29.99,
    size: 'M',
    quantity: 50,
    description: 'A comfortable and stylish white t-shirt made from 100% premium cotton. Perfect for everyday wear.',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
    category: 'shirts'
  },
  {
    name: 'Premium Blue Denim Jeans',
    color: 'blue',
    price: 79.99,
    size: 'L',
    quantity: 30,
    description: 'High-quality denim jeans with a modern slim fit and comfortable stretch. Perfect for casual and smart-casual looks.',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
    category: 'pants'
  },
  {
    name: 'Classic Black Sneakers',
    color: 'black',
    price: 89.99,
    size: 'M',
    quantity: 25,
    description: 'Comfortable and stylish black sneakers perfect for everyday wear. Features premium materials and cushioned sole.',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop',
    category: 'shoes'
  },
  {
    name: 'Cozy Red Hoodie',
    color: 'red',
    price: 59.99,
    size: 'L',
    quantity: 40,
    description: 'Warm and cozy red hoodie made from premium cotton blend. Perfect for cool weather and casual outings.',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop',
    category: 'shirts'
  },
  {
    name: 'Genuine Leather Wallet',
    color: 'brown',
    price: 39.99,
    size: 'M',
    quantity: 60,
    description: 'Genuine leather wallet with multiple card slots and coin pocket. Handcrafted with attention to detail.',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop',
    category: 'accessories'
  },
  {
    name: 'Navy Blue Dress Shirt',
    color: 'blue',
    price: 49.99,
    size: 'M',
    quantity: 35,
    description: 'Professional navy blue dress shirt perfect for office wear. Made from wrinkle-resistant fabric.',
    imageUrl: 'https://images.unsplash.com/photo-1594938291221-94c361f7e312?w=800&h=800&fit=crop',
    category: 'shirts'
  },
  {
    name: 'Black Leather Jacket',
    color: 'black',
    price: 199.99,
    size: 'L',
    quantity: 20,
    description: 'Stylish black leather jacket with modern design. Perfect for adding edge to any outfit.',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
    category: 'shirts'
  },
  {
    name: 'White Canvas Sneakers',
    color: 'white',
    price: 69.99,
    size: 'M',
    quantity: 45,
    description: 'Classic white canvas sneakers with rubber sole. Timeless design that goes with everything.',
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&h=800&fit=crop',
    category: 'shoes'
  },
  {
    name: 'Khaki Chino Pants',
    color: 'brown',
    price: 64.99,
    size: 'M',
    quantity: 28,
    description: 'Versatile khaki chino pants perfect for both casual and semi-formal occasions. Comfortable fit.',
    imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=800&fit=crop',
    category: 'pants'
  },
  {
    name: 'Silver Watch',
    color: 'silver',
    price: 149.99,
    size: 'M',
    quantity: 15,
    description: 'Elegant silver watch with leather strap. Perfect accessory for any occasion.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
    category: 'accessories'
  },
  {
    name: 'Gray Sweatshirt',
    color: 'gray',
    price: 44.99,
    size: 'L',
    quantity: 38,
    description: 'Comfortable gray sweatshirt made from soft cotton blend. Perfect for lounging or casual wear.',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop',
    category: 'shirts'
  },
  {
    name: 'Brown Leather Boots',
    color: 'brown',
    price: 129.99,
    size: 'M',
    quantity: 22,
    description: 'Stylish brown leather boots with durable sole. Perfect for outdoor activities and casual wear.',
    imageUrl: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&h=800&fit=crop',
    category: 'shoes'
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${products.length} products`);

    console.log('Sample products:');
    products.forEach(product => {
      console.log(`- ${product.name}: $${product.price}`);
    });

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedProducts();


