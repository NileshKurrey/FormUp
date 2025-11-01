// Auth middleware to check if user is authenticated
import type { IHttpRequest, IHttpResponse, INextFunction } from '../../domain/repositories/IHttpServer.js'
import { ApiError } from '../../shared/errors/ApiError.js'
import jwt from 'jsonwebtoken'
import { env } from '../../shared/utils/env/env.js'

export const authMiddleware = (req: IHttpRequest, res: IHttpResponse, next: INextFunction) => {
  const token = req.cookies.access_token
  if (!token) {
    return res.status(401).json(new ApiError(401, 'Access token is missing'))
  }
  jwt.verify(token, env.JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json(new ApiError(401, 'Invalid access token'))
    }
    req.user = decoded
    next()
  })
}
