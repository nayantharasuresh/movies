export interface MediaFilters {
  search: string;
  type: string;
  year: string;
}

export interface Media {
  id: number;
  title: string;
  type: string;
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFormData {
  title: string;
  type: string;
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearTime: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
}