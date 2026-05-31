// ดึง Pool มาจาก library 'pg' (node-postgres)
// Pool = กลุ่มของ connection ที่พร้อมใช้งาน แทนที่จะเปิด-ปิดทุกครั้ง
import { Pool } from 'pg';

// dotenv ช่วยให้อ่านค่าจากไฟล์ .env ได้
// เช่น process.env.DB_HOST จะได้ค่า 'localhost'
import dotenv from 'dotenv';

// โหลดค่าจากไฟล์ .env เข้ามาใน process.env
dotenv.config();

// สร้าง Pool ของ database connection
// Pool จะดูแลการเปิด/ปิด connection ให้เราอัตโนมัติ
// ทำให้ไม่ต้องเปิด connection ใหม่ทุกครั้งที่มี request เข้ามา
const pool = new Pool({
  // host = ที่อยู่ของ database server
  host: process.env.DB_HOST || 'localhost',

  // port = ช่องทางที่ PostgreSQL รับ connection (ค่าเริ่มต้นคือ 5432)
  port: Number(process.env.DB_PORT) || 5432,

  // database = ชื่อฐานข้อมูลที่ต้องการเชื่อมต่อ
  database: process.env.DB_NAME || 'todo_db',

  // user = ชื่อผู้ใช้ PostgreSQL
  user: process.env.DB_USER || 'postgres',

  // password = รหัสผ่าน PostgreSQL
  password: process.env.DB_PASSWORD || '',

  // max = จำนวน connection สูงสุดใน pool (default: 10)
  // ถ้า request เยอะ pool จะใช้ connection หมุนเวียนกัน
  max: 10,

  // idleTimeoutMillis = ถ้า connection ไม่ได้ใช้งานนาน 30 วินาที ให้ปิดทิ้ง
  idleTimeoutMillis: 30000,

  // connectionTimeoutMillis = ถ้าเชื่อมต่อไม่สำเร็จภายใน 2 วินาที ให้หยุด
  connectionTimeoutMillis: 2000,
});

// ฟังก์ชัน testConnection: ทดสอบว่าเชื่อมต่อ database ได้จริงไหม
// async = ฟังก์ชันที่ทำงานแบบรอผลก่อน (asynchronous)
export const testConnection = async (): Promise<void> => {
  try {
    // pool.query() = ส่งคำสั่ง SQL ไปยัง database
    // 'SELECT NOW()' = ขอเวลาปัจจุบันจาก database (ใช้แค่ทดสอบการเชื่อมต่อ)
    const result = await pool.query('SELECT NOW()');

    // แสดงผลว่าเชื่อมต่อสำเร็จ พร้อมเวลาปัจจุบัน
    console.log('✅ Database connected at:', result.rows[0].now);
  } catch (error) {
    // ถ้าเชื่อมต่อไม่ได้ แสดง error แล้วหยุดโปรแกรม
    console.error('❌ Database connection failed:', error);

    // process.exit(1) = หยุดโปรแกรมทันที (1 = มี error)
    process.exit(1);
  }
};

// export pool ออกไปให้ไฟล์อื่นใช้งาน
// ไฟล์อื่นจะ import pool มาแล้วเรียก pool.query() เพื่อคุยกับ database
export default pool;