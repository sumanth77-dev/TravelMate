export interface Guide {
  id: string;
  name: string;
  avatar: string;
  location: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  pricePerDay: number;
  specialties: string[];
  experience: number;
  bio: string;
  available: boolean;
}

export interface Booking {
  id: string;
  guideId: string;
  guideName: string;
  location: string;
  date: string;
  duration: number;
  members: number;
  status: "pending" | "approved" | "rejected";
  totalPrice: number;
  message: string;
  createdAt: string;
}

export interface Review {
  id: string;
  guideId: string;
  reviewer: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export type FilterState = {
  language: string;
  minRating: number;
  maxPrice: number;
  specialty: string;
};
