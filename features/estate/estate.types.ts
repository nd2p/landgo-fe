// Estate types
export interface CreatePostInput {
  title: string;
  description: string;
  price: number;
  area: number;
  province: string;
  district: string;
  ward: string;
  addressDetail?: string;
  propertyType: PropertyType;
  legalStatus: string;
  images?: string[];
  redBookImages: string[];
}

export enum PropertyType {
  Apartment = "apartment",
  House = "house",
  Land = "land",
  Villa = "villa",
}
