import fs from 'node:fs'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import { defaultRooms } from '../../src/data/rooms.js'
import { services as defaultSpaces } from '../../src/data/services.js'
import { defaultTestimonials } from '../../src/data/testimonials.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_FILE = path.resolve(__dirname, '../data/hotel.db')
const LEGACY_JSON_FILE = path.resolve(__dirname, '../data/db.json')

function ensureDirectory() {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true })
}

function nowIso() {
  return new Date().toISOString()
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
    testimonials: defaultTestimonials.map((testimonial, index) => ({
      ...testimonial,
      id: Number(testimonial.id) || index + 1,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    })),
  }
}

function openDb() {
  ensureDirectory()
  const db = new DatabaseSync(DB_FILE)
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      created_at TEXT,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY,
      slug TEXT,
      created_at TEXT,
      updated_at TEXT,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS spaces (
      id INTEGER PRIMARY KEY,
      slug TEXT,
      created_at TEXT,
      updated_at TEXT,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      room_id INTEGER,
      status TEXT,
      created_at TEXT,
      updated_at TEXT,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      reservation_id INTEGER,
      reference TEXT UNIQUE,
      status TEXT,
      created_at TEXT,
      updated_at TEXT,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY,
      created_at TEXT,
      updated_at TEXT,
      data TEXT NOT NULL
    );
  `)
  return db
}

function tableCount(db, table) {
  return db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count
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

function writeWholeDb(db, data) {
  const insertUser = db.prepare('INSERT INTO users (id, email, role, created_at, data) VALUES (?, ?, ?, ?, ?)')
  const insertRoom = db.prepare('INSERT INTO rooms (id, slug, created_at, updated_at, data) VALUES (?, ?, ?, ?, ?)')
  const insertSpace = db.prepare('INSERT INTO spaces (id, slug, created_at, updated_at, data) VALUES (?, ?, ?, ?, ?)')
  const insertReservation = db.prepare('INSERT INTO reservations (id, user_id, room_id, status, created_at, updated_at, data) VALUES (?, ?, ?, ?, ?, ?, ?)')
  const insertPayment = db.prepare('INSERT INTO payments (id, user_id, reservation_id, reference, status, created_at, updated_at, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
  const insertTestimonial = db.prepare('INSERT INTO testimonials (id, created_at, updated_at, data) VALUES (?, ?, ?, ?)')

  db.exec('BEGIN')

  try {
    db.exec('DELETE FROM users; DELETE FROM rooms; DELETE FROM spaces; DELETE FROM reservations; DELETE FROM payments; DELETE FROM testimonials;')

    for (const user of data.users || []) {
      insertUser.run(user.id, user.email, user.role || 'customer', user.createdAt || nowIso(), JSON.stringify(user))
    }

    for (const room of data.rooms || []) {
      insertRoom.run(room.id, room.slug || null, room.createdAt || nowIso(), room.updatedAt || nowIso(), JSON.stringify(room))
    }

    for (const space of data.spaces || []) {
      insertSpace.run(space.id, space.slug || null, space.createdAt || nowIso(), space.updatedAt || nowIso(), JSON.stringify(space))
    }

    for (const reservation of data.reservations || []) {
      insertReservation.run(
        reservation.id,
        reservation.userId || null,
        reservation.roomId || null,
        reservation.status || 'pending',
        reservation.createdAt || nowIso(),
        reservation.updatedAt || reservation.createdAt || nowIso(),
        JSON.stringify(reservation),
      )
    }

    for (const payment of data.payments || []) {
      insertPayment.run(
        payment.id,
        payment.userId || null,
        payment.reservationId || null,
        payment.reference || null,
        payment.status || 'pending',
        payment.createdAt || nowIso(),
        payment.updatedAt || payment.createdAt || nowIso(),
        JSON.stringify(payment),
      )
    }

    for (const testimonial of data.testimonials || []) {
      insertTestimonial.run(
        testimonial.id,
        testimonial.createdAt || nowIso(),
        testimonial.updatedAt || testimonial.createdAt || nowIso(),
        JSON.stringify(testimonial),
      )
    }

    db.exec('COMMIT')
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

export function ensureDb() {
  const db = openDb()

  try {
    const seed = createSeed()
    const legacy = readLegacyJson()
    const isEmpty = ['users', 'rooms', 'spaces', 'reservations', 'payments', 'testimonials'].every((table) => tableCount(db, table) === 0)

    if (isEmpty) {
      writeWholeDb(db, { ...seed, ...(legacy || {}) })
      return
    }

    const current = {
      users: parseRows(db.prepare('SELECT data FROM users ORDER BY id ASC').all()),
      rooms: parseRows(db.prepare('SELECT data FROM rooms ORDER BY id DESC').all()),
      spaces: parseRows(db.prepare('SELECT data FROM spaces ORDER BY id DESC').all()),
      reservations: parseRows(db.prepare('SELECT data FROM reservations ORDER BY id DESC').all()),
      payments: parseRows(db.prepare('SELECT data FROM payments ORDER BY id DESC').all()),
      testimonials: parseRows(db.prepare('SELECT data FROM testimonials ORDER BY id DESC').all()),
    }

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
      writeWholeDb(db, current)
    }
  } finally {
    db.close()
  }
}

export function readDb() {
  const db = openDb()

  try {
    return {
      users: parseRows(db.prepare('SELECT data FROM users ORDER BY id ASC').all()),
      rooms: parseRows(db.prepare('SELECT data FROM rooms ORDER BY id DESC').all()),
      spaces: parseRows(db.prepare('SELECT data FROM spaces ORDER BY id DESC').all()),
      reservations: parseRows(db.prepare('SELECT data FROM reservations ORDER BY id DESC').all()),
      payments: parseRows(db.prepare('SELECT data FROM payments ORDER BY id DESC').all()),
      testimonials: parseRows(db.prepare('SELECT data FROM testimonials ORDER BY id DESC').all()),
    }
  } finally {
    db.close()
  }
}

export function withDb(mutator) {
  const db = openDb()

  try {
    const snapshot = {
      users: parseRows(db.prepare('SELECT data FROM users ORDER BY id ASC').all()),
      rooms: parseRows(db.prepare('SELECT data FROM rooms ORDER BY id DESC').all()),
      spaces: parseRows(db.prepare('SELECT data FROM spaces ORDER BY id DESC').all()),
      reservations: parseRows(db.prepare('SELECT data FROM reservations ORDER BY id DESC').all()),
      payments: parseRows(db.prepare('SELECT data FROM payments ORDER BY id DESC').all()),
      testimonials: parseRows(db.prepare('SELECT data FROM testimonials ORDER BY id DESC').all()),
    }

    const result = mutator(snapshot)
    writeWholeDb(db, snapshot)
    return result
  } finally {
    db.close()
  }
}

function nextId(collection) {
  const maxId = collection.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0)
  return maxId + 1
}

export { DB_FILE, nextId }
