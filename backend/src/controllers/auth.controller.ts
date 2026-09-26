import { Request, Response } from 'express';
import { prisma } from '../services/prisma.service';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { AppResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types/auth.types';

export class AuthController {
  /**
   * Register a new Farmer User
   * POST /api/v1/auth/register
   */
  static async register(req: Request, res: Response): Promise<any> {
    try {
      const {
        phone,
        password,
        name,
        email,
        village,
        taluka,
        district,
        state,
        landArea,
        landAreaUnit,
        language,
      } = req.body;

      // Normalize phone number format (e.g. +919876543210)
      let normalizedPhone = phone.trim().replace(/[\s-]/g, '');
      if (/^\d{10}$/.test(normalizedPhone)) {
        normalizedPhone = `+91${normalizedPhone}`;
      }

      // Check if phone number already exists
      const existingPhone = await prisma.user.findFirst({
        where: {
          OR: [
            { phone: normalizedPhone },
            { phone: normalizedPhone.replace(/^\+91/, '') },
          ],
        },
      });

      if (existingPhone) {
        return AppResponse.error(
          req,
          res,
          'An account with this phone number already exists. Please log in instead.',
          409
        );
      }

      // Check if email already exists (if provided)
      if (email && email.trim()) {
        const existingEmail = await prisma.user.findUnique({
          where: { email: email.trim().toLowerCase() },
        });
        if (existingEmail) {
          return AppResponse.error(
            req,
            res,
            'An account with this email address already exists.',
            409
          );
        }
      }

      // Hash the password securely
      const hashedPassword = await hashPassword(password);

      // Create farmer user in Neon PostgreSQL
      const user = await prisma.user.create({
        data: {
          phone: normalizedPhone,
          password: hashedPassword,
          name: name.trim(),
          email: email && email.trim() ? email.trim().toLowerCase() : null,
          village: village?.trim() || null,
          taluka: taluka?.trim() || null,
          district: district?.trim() || null,
          state: state || 'Maharashtra',
          landArea: landArea ? Number(landArea) : null,
          landAreaUnit: landAreaUnit || 'Acre',
          language: language || 'mr',
          isVerified: true,
        },
      });

      // Generate JWT Token
      const token = generateToken({
        userId: user.id,
        phone: user.phone,
      });

      // Return sanitized user object
      const sanitizedUser = {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        village: user.village,
        taluka: user.taluka,
        district: user.district,
        state: user.state,
        landArea: user.landArea ? Number(user.landArea) : null,
        landAreaUnit: user.landAreaUnit,
        language: user.language,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return AppResponse.created(
        req,
        res,
        {
          token,
          user: sanitizedUser,
        },
        'Farmer account registered successfully'
      );
    } catch (error: any) {
      return AppResponse.error(
        req,
        res,
        'Failed to register farmer account',
        500,
        error?.message
      );
    }
  }

  /**
   * Log In an existing Farmer
   * POST /api/v1/auth/login
   */
  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { identifier, password } = req.body;
      const raw = identifier.trim();
      const rawDigits = raw.replace(/[\s-]/g, '');
      const withPlus91 = rawDigits.startsWith('+91')
        ? rawDigits
        : /^\d{10}$/.test(rawDigits)
        ? `+91${rawDigits}`
        : `+91${rawDigits}`;
      const withoutPlus91 = rawDigits.replace(/^\+91/, '');

      // Find user by phone (variations) OR by email
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { phone: raw },
            { phone: rawDigits },
            { phone: withPlus91 },
            { phone: withoutPlus91 },
            { email: raw.toLowerCase() },
          ],
        },
      });

      if (!user) {
        return AppResponse.error(
          req,
          res,
          'Invalid phone number/email or password.',
          401
        );
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return AppResponse.error(
          req,
          res,
          'Invalid phone number/email or password.',
          401
        );
      }

      // Generate JWT Token
      const token = generateToken({
        userId: user.id,
        phone: user.phone,
      });

      // Return sanitized user object
      const sanitizedUser = {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        village: user.village,
        taluka: user.taluka,
        district: user.district,
        state: user.state,
        landArea: user.landArea ? Number(user.landArea) : null,
        landAreaUnit: user.landAreaUnit,
        language: user.language,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return AppResponse.success(
        req,
        res,
        {
          token,
          user: sanitizedUser,
        },
        'Logged in successfully'
      );
    } catch (error: any) {
      return AppResponse.error(
        req,
        res,
        'Login failed',
        500,
        error?.message
      );
    }
  }

  /**
   * Get Current Authenticated Farmer Profile
   * GET /api/v1/auth/me
   */
  static async getMe(req: AuthRequest, res: Response): Promise<any> {
    return AppResponse.success(
      req,
      res,
      req.user,
      'Farmer profile retrieved successfully'
    );
  }

  /**
   * Update Farmer Profile
   * PUT /api/v1/auth/profile
   */
  static async updateProfile(req: AuthRequest, res: Response): Promise<any> {
    try {
      if (!req.user) {
        return AppResponse.error(req, res, 'Unauthorized', 401);
      }

      const updateData: any = {};
      const fields = [
        'name',
        'email',
        'village',
        'taluka',
        'district',
        'state',
        'landArea',
        'landAreaUnit',
        'language',
        'avatarUrl',
      ];

      for (const field of fields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: updateData,
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

      const sanitizedUser = {
        ...updatedUser,
        landArea: updatedUser.landArea ? Number(updatedUser.landArea) : null,
      };

      return AppResponse.success(
        req,
        res,
        sanitizedUser,
        'Profile updated successfully'
      );
    } catch (error: any) {
      return AppResponse.error(
        req,
        res,
        'Failed to update profile',
        500,
        error?.message
      );
    }
  }

  /**
   * Logout Confirmation
   * POST /api/v1/auth/logout
   */
  static async logout(req: Request, res: Response): Promise<any> {
    return AppResponse.success(
      req,
      res,
      null,
      'Logged out successfully. Please clear the client authorization token.'
    );
  }
}
