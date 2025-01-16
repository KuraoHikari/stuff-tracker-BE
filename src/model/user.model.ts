import { Request } from 'express';

interface BaseUser {
  email: string;
  name?: string;
}

interface AuthRequest {
  email: string;
  password: string;
}

interface BaseResponse {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterUserRequest extends AuthRequest {
  name: string;
}

export interface LoginUserRequest extends AuthRequest {}

export interface JwtSignRequest {
  id: string;
  email: string;
}

export interface UserResponse extends BaseUser {}

export interface ValidateUserResponse extends BaseResponse {}

export interface LoginResponse {
  access_token: string;
}

export interface UserRequest extends Request {
  user: BaseUser & { id: string };
}

export type UserProfile = {
  id: string;
  email: string;
  name?: string;
};
