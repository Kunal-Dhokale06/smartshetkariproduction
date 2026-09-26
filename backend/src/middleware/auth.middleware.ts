import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { prisma } from '../services/prisma.service';
import { AppResponse } from '../utils/apiResponse';
import { AuthRequest, UserSanitized } from '../types/auth.types';

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return AppResponse.error(
        req,
        res,
        'Authentication required. Please provide a valid Bearer token.',
        401
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return AppResponse.error(req, res, 'Authentication token missing.', 401);
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return AppResponse.error(
        req,
        res,
        'Invalid or expired authentication token. Please log in again.',
        401
      );
    }

    // Verify farmer user exists in Neon database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        avatarUrl: true,
        village: true,
        taluka: true,
        district: true,
        state: true,
        landArea: true,
        landAreaUnit: true,
        language: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return AppResponse.error(
        req,
        res,
        'User account not found or deactivated.',
        401
      );
    }

    // Convert Decimal landArea to number for clean JSON serialization
    const sanitizedUser: UserSanitized = {
      ...user,
      landArea: user.landArea ? Number(user.landArea) : null,
    };

    // Attach authenticated farmer user to Request object
    req.user = sanitizedUser;

    return next();
  } catch (error: any) {
    return AppResponse.error(
      req,
      res,
      'Authentication verification failed.',
      401,
      error?.message
    );
  }
}
