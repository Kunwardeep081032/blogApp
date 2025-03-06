// TS types for whole app

export interface JwtPayload {
  id: string;
  email: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: any;
  error?: any;
}

export interface UserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
  bio: string;
  website: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  isEmailVerified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: string;
      };
    }
  }
}
