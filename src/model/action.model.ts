export interface CreateActionRequest {
  name: string;
  description?: string;
}

export interface UpdateActionRequest {
  name?: string;
  description?: string;
}

export interface ActionResponse {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionDetailResponse extends ActionResponse {}

export interface ActionListResponse {
  actions: ActionResponse[];
}
