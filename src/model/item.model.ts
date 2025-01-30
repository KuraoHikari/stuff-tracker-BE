// Define the CreateItemRequest interface
export interface CreateItemRequest {
  name: string; // Name of the item
  description?: string; // Optional description of the item
  purchasePrice?: number; // Optional purchase price of the item
  sellPrice?: number; // Optional sell price of the item
  estimatedValue?: number; // Optional estimated value of the item
  purchaseDate?: Date; // Optional purchase date of the item
  categoryId?: string; // Optional category ID of the item
  image?: string; // Optional image URL of the item
  conditionId?: string; // Optional condition ID of the item
  statusId?: string; // Optional status ID of the item
  locationId?: string; // Optional location ID of the item
}

// Define the UpdateItemRequest interface
export interface UpdateItemRequest {
  name?: string; // Optional name of the item
  description?: string; // Optional description of the item
  purchasePrice?: number; // Optional purchase price of the item
  sellPrice?: number; // Optional sell price of the item
  estimatedValue?: number; // Optional estimated value of the item
  purchaseDate?: Date; // Optional purchase date of the item
  categoryId?: string; // Optional category ID of the item
  image?: string; // Optional image URL of the item
  conditionId?: string; // Optional condition ID of the item
  statusId?: string; // Optional status ID of the item
  locationId?: string; // Optional location ID of the item
}

// Define the ItemResponse interface
export interface ItemResponse {
  id: string; // ID of the item
  name: string; // Name of the item
  description?: string; // Optional description of the item
  purchasePrice?: number; // Optional purchase price of the item
  sellPrice?: number; // Optional sell price of the item
  estimatedValue?: number; // Optional estimated value of the item
  purchaseDate?: Date; // Optional purchase date of the item
  categoryId?: string; // Optional category ID of the item
  image?: string; // Optional image URL of the item
  conditionId?: string; // Optional condition ID of the item
  statusId?: string; // Optional status ID of the item
  locationId?: string; // Optional location ID of the item
  ownerId: string; // Owner ID of the item
  createdAt: Date; // Creation date of the item
  updatedAt: Date; // Last update date of the item
}

// Define the ItemDetailResponse interface which extends ItemResponse
export interface ItemDetailResponse extends ItemResponse {}

// Define the ItemListResponse interface
export interface ItemListResponse {
  items: ItemResponse[]; // Array of item responses
}

// Define the ItemEditResponse interface which extends ItemResponse
export interface ItemEditResponse extends ItemResponse {
  category: string; // Category name of the item
  condition: string; // Condition name of the item
  location: string; // Location name of the item
  status: string; // Status name of the item
}

export interface ItemCreateResponse extends ItemResponse {
  category: string; // Category name of the item
  condition: string; // Condition name of the item
  location: string; // Location name of the item
  status: string; // Status name of the item
}
