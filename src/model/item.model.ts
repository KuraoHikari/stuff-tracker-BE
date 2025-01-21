export interface CreateItemRequest {
  name: string;
  description?: string;
  purchasePrice?: number;
  sellPrice?: number;
  estimatedValue?: number;
  purchaseDate?: Date;
  categoryId?: string;
  image?: string;
  conditionId?: string;
  statusId?: string;
  locationId?: string;
}

export interface UpdateItemRequest {
  name?: string;
  description?: string;
  purchasePrice?: number;
  sellPrice?: number;
  estimatedValue?: number;
  purchaseDate?: Date;
  categoryId?: string;
  image?: string;
  conditionId?: string;
  statusId?: string;
  locationId?: string;
}

export interface ItemResponse {
  id: string;
  name: string;
  description?: string;
  purchasePrice?: number;
  sellPrice?: number;
  estimatedValue?: number;
  purchaseDate?: Date;
  categoryId?: string;
  image?: string;
  conditionId?: string;
  statusId?: string;
  locationId?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemDetailResponse extends ItemResponse {}

export interface ItemListResponse {
  items: ItemResponse[];
}

export interface ItemEditResponse extends ItemResponse {
  category: string;
  condition: string;
  location: string;
  status: string;
}
