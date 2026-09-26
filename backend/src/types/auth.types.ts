import { Request } from 'express';

export interface UserSanitized {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  village: string | null;
  taluka: string | null;
  district: string | null;
  state: string;
  landArea: number | null;
  landAreaUnit: string;
  language: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: UserSanitized;
}
