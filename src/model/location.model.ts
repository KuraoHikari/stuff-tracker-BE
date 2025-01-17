import { Request } from 'express';

export interface BaseLocation {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface LocationResponse extends BaseLocation {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationRequest extends Request {
  location: BaseLocation & { id: string };
}

export interface LocationListResponse {
  locations: LocationResponse[];
}

export interface LocationDetailResponse {
  location: LocationResponse;
}

export interface CreateLocationRequest extends BaseLocation {}

export interface UpdateLocationRequest extends BaseLocation {}

export interface DeleteLocationRequest {
  id: string;
}

export interface LocationService {
  createLocation(data: CreateLocationRequest): Promise<LocationResponse>;
  getLocations(): Promise<LocationListResponse>;
  getLocation(id: string): Promise<LocationDetailResponse>;
  updateLocation(
    id: string,
    data: UpdateLocationRequest,
  ): Promise<LocationResponse>;
  deleteLocation(id: string): Promise<void>;
}
