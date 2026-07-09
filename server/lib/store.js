import fs from 'node:fs'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise'
import { fileURLToPath } from 'node:url'
import { defaultRooms } from '../../src/data/rooms.js'
import { services as defaultSpaces } from '../../src/data/services.js'
import { defaultTestimonials } from '../../src/data/testimonials.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const LEGACY_JSON_FILE = path.resolve(__dirname, '../data/db.json')

let pool

function nowIso() {
  return new Date().toISOString()
}

function getDbConfig(withDatabase = true) {
  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0,
    multipleStatements: true,
  }

  if (withDatabase) {
    config.database = process.env.DB_NAME || 'hotel_le_morphee'
  }

  return config
}

async function getPool() {
  if (!pool) {
    pool = mysql.createPool(getDbConfig(true))
  }

  return pool
}

function createSeed() {
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'

  return {
    users: [
      {
        id: 1,
        name: 'Administrateur Hôtel Le Morphée',
        email: 'hotellemorphee8@gmail.com',
        passwordHash: bcrypt.hashSync(adminPassword, 10),
        role: 'admin',
        createdAt: nowIso(),
      },
    ],
    rooms: defaultRooms.map((room, index) => ({
      ...room,
      id: Number(room.id) || index + 1,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    })),
    spaces: defaultSpaces.map((space, index) => ({
      ...space,
      id: index + 1,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    })),
    reservations: [],
    payments: [],
    contacts: [],
    newsletters: [],
    testimonials: defaultTestimonials.map((testimonial, index) => ({
      ...testimonial,
      id: Number(testimonial.id) || index + 1,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    })),
  }
}

function parseRows(rows) {
  return rows.map((row) => JSON.parse(row.data))
}

function readLegacyJson() {
  if (!fs.existsSync(LEGACY_JSON_FILE)) return null

  try {
    return JSON.parse(fs.readFileSync(LEGACY_JSON_FILE, 'utf8').replace(/^\uFEFF/, ''))
  } catch {
    return null
  }
}

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection(getDbConfig(false))
  const dbName = process.env.DB_NAME || 'hotel_le_morphee'

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
  } finally {
    await connection.end()
  }
}

async function createTables(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      role VARCHAR(50) NOT NULL,
      created_at VARCHAR(50) NULL,
      data LONGTEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id INT PRIMARY KEY,
      slug VARCHAR(255) NULL,
      created_at VARCHAR(50) NULL,
      updated_at VARCHAR(50) NULL,
      data LONGTEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS spaces (
      id INT PRIMARY KEY,
      slug VARCHAR(255) NULL,
      created_at VARCHAR(50) NULL,
      updated_at VARCHAR(50) NULL,
      data LONGTEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id INT PRIMARY KEY,
      user_id INT NULL,
      room_id INT NULL,
      status VARCHAR(50) NULL,
      created_at VARCHAR(50) NULL,
      updated_at VARCHAR(50) NULL,
      data LONGTEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INT PRIMARY KEY,
      user_id INT NULL,
      reservation_id INT NULL,
      reference VARCHAR(255) NULL UNIQUE,
      status VARCHAR(50) NULL,
      created_at VARCHAR(50) NULL,
      updated_at VARCHAR(50) NULL,
      data LONGTEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INT PRIMARY KEY,
      email VARCHAR(255) NULL,
      status VARCHAR(50) NULL,
      created_at VARCHAR(50) NULL,
      updated_at VARCHAR(50) NULL,
      data LONGTEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS newsletters (
      id INT PRIMARY KEY,
      email VARCHAR(255) NULL UNIQUE,
      status VARCHAR(50) NULL,
      created_at VARCHAR(50) NULL,
      updated_at VARCHAR(50) NULL,
      data LONGTEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INT PRIMARY KEY,
      created_at VARCHAR(50) NULL,
      updated_at VARCHAR(50) NULL,
      data LONGTEXT NOT NULL
    );
  `)
}

async function tableCount(db, table) {
  const [rows] = await db.query(`SELECT COUNT(*) AS count FROM \`${table}\``)
  return Number(rows[0]?.count || 0)
}

async function loadSnapshot(db) {
  const [users] = await db.query('SELECT data FROM users ORDER BY id ASC')
  const [rooms] = await db.query('SELECT data FROM rooms ORDER BY id DESC')
  const [spaces] = await db.query('SELECT data FROM spaces ORDER BY id DESC')
  const [reservations] = await db.query('SELECT data FROM reservations ORDER BY id DESC')
  const [payments] = await db.query('SELECT data FROM payments ORDER BY id DESC')
  const [contacts] = await db.query('SELECT data FROM contacts ORDER BY id DESC')
  const [newsletters] = await db.query('SELECT data FROM newsletters ORDER BY id DESC')
  const [testimonials] = await db.query('SELECT data FROM testimonials ORDER BY id DESC')

  return {
    users: parseRows(users),
    rooms: parseRows(rooms),
    spaces: parseRows(spaces),
    reservations: parseRows(reservations),
    payments: parseRows(payments),
    contacts: parseRows(contacts),
    newsletters: parseRows(newsletters),
    testimonials: parseRows(testimonials),
  }
}

async function writeWholeDb(connection, data) {
  await connection.beginTransaction()

  try {
    await connection.query('DELETE FROM users')
    await connection.query('DELETE FROM rooms')
    await connection.query('DELETE FROM spaces')
    await connection.query('DELETE FROM reservations')
    await connection.query('DELETE FROM payments')
    await connection.query('DELETE FROM contacts')
    await connection.query('DELETE FROM newsletters')
    await connection.query('DELETE FROM testimonials')

    for (const user of data.users || []) {
      await connection.query(
        'INSERT INTO users (id, email, role, created_at, data) VALUES (?, ?, ?, ?, ?)',
        [user.id, user.email, user.role || 'customer', user.createdAt || nowIso(), JSON.stringify(user)],
      )
    }

    for (const room of data.rooms || []) {
      await connection.query(
        'INSERT INTO rooms (id, slug, created_at, updated_at, data) VALUES (?, ?, ?, ?, ?)',
        [room.id, room.slug || null, room.createdAt || nowIso(), room.updatedAt || nowIso(), JSON.stringify(room)],
      )
    }

    for (const space of data.spaces || []) {
      await connection.query(
        'INSERT INTO spaces (id, slug, created_at, updated_at, data) VALUES (?, ?, ?, ?, ?)',
        [space.id, space.slug || null, space.createdAt || nowIso(), space.updatedAt || nowIso(), JSON.stringify(space)],
      )
    }

    for (const reservation of data.reservations || []) {
      await connection.query(
        'INSERT INTO reservations (id, user_id, room_id, status, created_at, updated_at, data) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          reservation.id,
          reservation.userId || null,
          reservation.roomId || null,
          reservation.status || 'pending',
          reservation.createdAt || nowIso(),
          reservation.updatedAt || reservation.createdAt || nowIso(),
          JSON.stringify(reservation),
        ],
      )
    }

    for (const payment of data.payments || []) {
      await connection.query(
        'INSERT INTO payments (id, user_id, reservation_id, reference, status, created_at, updated_at, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          payment.id,
          payment.userId || null,
          payment.reservationId || null,
          payment.reference || null,
          payment.status || 'pending',
          payment.createdAt || nowIso(),
          payment.updatedAt || payment.createdAt || nowIso(),
          JSON.stringify(payment),
        ],
      )
    }

    for (const contact of data.contacts || []) {
      await connection.query(
        'INSERT INTO contacts (id, email, status, created_at, updated_at, data) VALUES (?, ?, ?, ?, ?, ?)',
        [
          contact.id,
          contact.email || null,
          contact.status || 'new',
          contact.createdAt || nowIso(),
          contact.updatedAt || contact.createdAt || nowIso(),
          JSON.stringify(contact),
        ],
      )
    }

    for (const newsletter of data.newsletters || []) {
      await connection.query(
        'INSERT INTO newsletters (id, email, status, created_at, updated_at, data) VALUES (?, ?, ?, ?, ?, ?)',
        [
          newsletter.id,
          newsletter.email || null,
          newsletter.status || 'subscribed',
          newsletter.createdAt || nowIso(),
          newsletter.updatedAt || newsletter.createdAt || nowIso(),
          JSON.stringify(newsletter),
        ],
      )
    }

    for (const testimonial of data.testimonials || []) {
      await connection.query(
        'INSERT INTO testimonials (id, created_at, updated_at, data) VALUES (?, ?, ?, ?)',
        [
          testimonial.id,
          testimonial.createdAt || nowIso(),
          testimonial.updatedAt || testimonial.createdAt || nowIso(),
          JSON.stringify(testimonial),
        ],
      )
    }

    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  }
}

export async function ensureDb() {
  await ensureDatabaseExists()

  const db = await getPool()
  await createTables(db)

  const seed = createSeed()
  const legacy = readLegacyJson()
  const tables = ['users', 'rooms', 'spaces', 'reservations', 'payments', 'contacts', 'newsletters', 'testimonials']
  const counts = await Promise.all(tables.map((table) => tableCount(db, table)))
  const isEmpty = counts.every((count) => count === 0)

  if (isEmpty) {
    const connection = await db.getConnection()

    try {
      await writeWholeDb(connection, { ...seed, ...(legacy || {}) })
    } finally {
      connection.release()
    }

    return
  }

  const current = await loadSnapshot(db)
  let changed = false

  if (!current.users.length) {
    current.users = seed.users
    changed = true
  }
  if (!current.rooms.length) {
    current.rooms = seed.rooms
    changed = true
  }
  if (!current.spaces.length) {
    current.spaces = seed.spaces
    changed = true
  }
  if (!current.testimonials.length) {
    current.testimonials = seed.testimonials
    changed = true
  }

  if (changed) {
    const connection = await db.getConnection()

    try {
      await writeWholeDb(connection, current)
    } finally {
      connection.release()
    }
  }
}

export async function readDb() {
  const db = await getPool()
  return loadSnapshot(db)
}

export async function withDb(mutator) {
  const db = await getPool()
  const snapshot = await loadSnapshot(db)
  const result = await mutator(snapshot)
  const connection = await db.getConnection()

  try {
    await writeWholeDb(connection, snapshot)
  } finally {
    connection.release()
  }

  return result
}

function nextId(collection) {
  const maxId = collection.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0)
  return maxId + 1
}

export { nextId }
