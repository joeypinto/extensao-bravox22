import jwt from 'jsonwebtoken'

const KEY_SECRET = process.env.KEY_SECRET_JWT_EXTBRAVOX

export default function (req, res) {
    return res.status(200).json({john:"dev"})
}
