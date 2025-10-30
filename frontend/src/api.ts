import axios from 'axios';
import type { Media, MediaFormData, PaginationInfo, MediaFilters } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const mediaAPI = {
  async getMedia(
    page: number = 1, 
    limit: number = 10, 
    filters: MediaFilters = { search: '', type: 'ALL', year: '' }
  ): Promise<{ media: Media[]; pagination: PaginationInfo }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters.search) params.append('search', filters.search);
    if (filters.type && filters.type !== 'ALL') params.append('type', filters.type);
    if (filters.year) params.append('year', filters.year);
    
    const response = await api.get(`/media?${params.toString()}`);
    return response.data;
  },

  async createMedia(data: MediaFormData): Promise<Media> {
    const response = await api.post('/media', data);
    return response.data;
  },

  async updateMedia(id: number, data: MediaFormData): Promise<Media> {
    const response = await api.put(`/media/${id}`, data);
    return response.data;
  },

  async deleteMedia(id: number): Promise<void> {
    await api.delete(`/media/${id}`);
  },
};