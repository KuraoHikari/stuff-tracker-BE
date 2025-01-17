export interface CreateStatusRequest {
  name: string;
  description?: string;
}

export interface UpdateStatusRequest {
  name?: string;
  description?: string;
}

export interface StatusResponse {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusDetailResponse extends StatusResponse {}

export interface StatusListResponse {
  statuses: StatusResponse[];
}
