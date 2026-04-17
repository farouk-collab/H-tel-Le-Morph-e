import jwt from 'jsonwebtoken'

const JWT_EXPIRES_IN = '7d'

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'change-me-in-production',
    { expiresIn: JWT_EXPIRES_IN },
  )
}

export function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user
  return safeUser
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Authentification requise.' })
  }

  try {
    req.auth = jwt.verify(token, process.env.JWT_SECRET || 'change-me-in-production')
    next()
  } catch {
    return res.status(401).json({ message: 'Session invalide ou expirée.' })
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.auth || req.auth.role !== role) {
      return res.status(403).json({ message: 'Accès refusé.' })
    }

    next()
  }
}
