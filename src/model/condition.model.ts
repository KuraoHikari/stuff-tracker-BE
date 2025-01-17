export interface CreateConditionRequest {
  name: string;
  description?: string;
}

export interface UpdateConditionRequest {
  name?: string;
  description?: string;
}

export interface ConditionResponse {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConditionDetailResponse extends ConditionResponse {}

export interface ConditionListResponse {
  conditions: ConditionResponse[];
}
