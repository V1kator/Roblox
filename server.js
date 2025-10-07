import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
require("dotenv").config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  ssl: true,
  tlsAllowInvalidCertificates: false,
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Conectado ao MongoDB com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err);
  }
}

connectDB();
