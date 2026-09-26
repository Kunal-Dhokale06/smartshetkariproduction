import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Crop } from '../types';

const TOKEN_STORAGE_KEY = '@smartshetkari_auth_token_v1';
const USER_STORAGE_KEY = '@smartshetkari_auth_user_v1';

// Automatically determine backend URL based on host environment
export function getApiBaseUrl(): string {
  // 1. Check for configured public production API URL first
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Constants.expoConfig?.extra?.apiUrl) {
    return Constants.expoConfig.extra.apiUrl;
  }

  // 2. If running in browser (web / mobile web)
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5000/api/v1';
    }
    return `http://${host}:5000/api/v1`;
  }

  // 3. If hostUri is present (Expo Go on real device or emulator)
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:5000/api/v1`;
  }

  // 4. Default fallback for standalone mobile APK
  return 'https://smartshetkariproduction-backend.onrender.com/api/v1';
}

class ApiService {
  private token: string | null = null;
  private inFlightRequests = new Map<string, Promise<any>>();
  private memoryCache = new Map<string, { data: any; expiry: number }>();

  setAuthHeader(token: string | null): void {
    this.token = token;
  }

  async getToken(): Promise<string | null> {
    if (this.token) return this.token;
    const stored = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      this.token = stored;
      return stored;
    }
    return null;
  }

  async login(credentials: { identifier: string; password: string }): Promise<{ token: string; user: any; message?: string }> {
    const res = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.success && res.data?.token) {
      this.token = res.data.token;
      return res.data;
    }
    throw new Error(res.message || 'Login failed. Invalid phone or password.');
  }

  async register(payload: any): Promise<{ token: string; user: any; message?: string }> {
    const res = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.success && res.data?.token) {
      this.token = res.data.token;
      return res.data;
    }
    throw new Error(res.message || 'Registration failed. Please check your information.');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      this.token = null;
      this.memoryCache.clear();
      this.inFlightRequests.clear();
    }
  }

  async getMe(): Promise<any> {
    const res = await this.request<any>('/auth/me', { method: 'GET' });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to fetch current user profile');
  }

  async updateProfile(updates: any): Promise<any> {
    const res = await this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update profile');
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    ttlMs = 0
  ): Promise<{ success: boolean; data?: T; message?: string; error?: any }> {
    const method = (options.method || 'GET').toUpperCase();
    const isGet = method === 'GET';
    const cacheKey = `${method}:${endpoint}`;

    // 1. Return from memory cache if valid
    if (isGet && ttlMs > 0) {
      const cached = this.memoryCache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        return cached.data;
      }
    }

    // 2. In-flight request deduplication for concurrent GETs
    if (isGet && this.inFlightRequests.has(cacheKey)) {
      return this.inFlightRequests.get(cacheKey)!;
    }

    const executeRequest = async (): Promise<{ success: boolean; data?: T; message?: string; error?: any }> => {
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 12000) : null;

      try {
        const baseUrl = getApiBaseUrl();
        const token = await this.getToken();

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(options.headers as Record<string, string>),
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${baseUrl}${endpoint}`, {
          ...options,
          headers,
          signal: controller?.signal,
        });

        if (timeoutId) clearTimeout(timeoutId);

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error('Backend server returned non-JSON response. Switched to offline mode.');
        }

        const json = await response.json();

        // Cache successful response if TTL provided
        if (isGet && ttlMs > 0 && json.success) {
          this.memoryCache.set(cacheKey, { data: json, expiry: Date.now() + ttlMs });
        }

        return json;
      } catch (error: any) {
        if (timeoutId) clearTimeout(timeoutId);
        const isAbort = error?.name === 'AbortError';
        return {
          success: false,
          message: isAbort ? 'Request timed out' : error?.message || 'Network request failed',
          error,
        };
      } finally {
        if (isGet) {
          this.inFlightRequests.delete(cacheKey);
        }
      }
    };

    if (isGet) {
      const promise = executeRequest();
      this.inFlightRequests.set(cacheKey, promise);
      return promise;
    }

    return executeRequest();
  }

  // ---------------------------------------------------------------------------
  // CROPS CRUD METHODS
  // ---------------------------------------------------------------------------

  async getCrops(): Promise<Crop[]> {
    const res = await this.request<Crop[]>('/crops', { method: 'GET' });
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to fetch crops from backend');
  }

  async createCrop(crop: Omit<Crop, 'id'>): Promise<Crop> {
    const res = await this.request<Crop>('/crops', {
      method: 'POST',
      body: JSON.stringify(crop),
    });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to create crop on backend');
  }

  async updateCrop(id: string, updates: Partial<Crop>): Promise<Crop> {
    const res = await this.request<Crop>(`/crops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update crop on backend');
  }

  async deleteCrop(id: string): Promise<boolean> {
    const res = await this.request(`/crops/${id}`, {
      method: 'DELETE',
    });
    if (res.success) {
      return true;
    }
    throw new Error(res.message || 'Failed to delete crop on backend');
  }

  async getDeletedCrops(): Promise<Crop[]> {
    const res = await this.request<Crop[]>('/crops/trash', { method: 'GET' });
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  }

  async restoreCrop(id: string): Promise<Crop> {
    const res = await this.request<Crop>(`/crops/${id}/restore`, {
      method: 'POST',
    });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to restore crop on backend');
  }

  async permanentlyDeleteCrop(id: string): Promise<boolean> {
    const res = await this.request(`/crops/${id}/permanent`, {
      method: 'DELETE',
    });
    if (res.success) {
      return true;
    }
    throw new Error(res.message || 'Failed to permanently delete crop on backend');
  }

  // ---------------------------------------------------------------------------
  // EXPENSES CRUD METHODS
  // ---------------------------------------------------------------------------

  async getExpenses(filters?: { crop?: string; category?: string }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.crop) params.append('crop', filters.crop);
    if (filters?.category) params.append('category', filters.category);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await this.request(`/expenses${query}`, { method: 'GET' });
    if (res.success && res.data) {
      return res.data; // { items, totalAmount, count, categoryBreakdown }
    }
    throw new Error(res.message || 'Failed to fetch expenses from backend');
  }

  async createExpense(expense: Omit<any, 'id'>): Promise<any> {
    const res = await this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to create expense on backend');
  }

  async updateExpense(id: string, updates: Partial<any>): Promise<any> {
    const res = await this.request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update expense on backend');
  }

  async deleteExpense(id: string): Promise<boolean> {
    const res = await this.request(`/expenses/${id}`, {
      method: 'DELETE',
    });
    if (res.success) {
      return true;
    }
    throw new Error(res.message || 'Failed to delete expense on backend');
  }

  async getExpenseSummary(year?: number): Promise<any> {
    const query = year ? `?year=${year}` : '';
    const res = await this.request(`/expenses/summary${query}`, { method: 'GET' });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to fetch expense summary');
  }

  // ---------------------------------------------------------------------------
  // SALES CRUD METHODS
  // ---------------------------------------------------------------------------

  async getSales(filters?: { crop?: string; year?: number; paymentStatus?: string }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.crop) params.append('crop', filters.crop);
    if (filters?.year) params.append('year', String(filters.year));
    if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await this.request(`/sales${query}`, { method: 'GET' });
    if (res.success && res.data) {
      return res.data; // { items, totalAmount, count }
    }
    throw new Error(res.message || 'Failed to fetch sales from backend');
  }

  async createSale(sale: Omit<any, 'id'>): Promise<any> {
    const res = await this.request('/sales', {
      method: 'POST',
      body: JSON.stringify(sale),
    });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to create sale on backend');
  }

  async updateSale(id: string, updates: Partial<any>): Promise<any> {
    const res = await this.request(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update sale on backend');
  }

  async deleteSale(id: string): Promise<boolean> {
    const res = await this.request(`/sales/${id}`, {
      method: 'DELETE',
    });
    if (res.success) {
      return true;
    }
    throw new Error(res.message || 'Failed to delete sale on backend');
  }

  async getSaleSummary(year?: number): Promise<any> {
    const query = year ? `?year=${year}` : '';
    const res = await this.request(`/sales/summary${query}`, { method: 'GET' });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to fetch sale summary');
  }

  // ---------------------------------------------------------------------------
  // DIARY CRUD METHODS
  // ---------------------------------------------------------------------------

  async getDiaryNotes(filters?: { crop?: string }): Promise<any> {
    const params = new URLSearchParams();
    if (filters?.crop) params.append('crop', filters.crop);
    const query = params.toString() ? `?${params.toString()}` : '';

    const res = await this.request(`/diary${query}`, { method: 'GET' });
    if (res.success && res.data) {
      return res.data; // { items, count }
    }
    throw new Error(res.message || 'Failed to fetch diary notes from backend');
  }

  async createDiaryNote(note: {
    content: string;
    crop?: string;
    cropId?: string;
    date: string;
    source?: 'text' | 'voice' | 'TEXT' | 'VOICE';
  }): Promise<any> {
    const res = await this.request('/diary', {
      method: 'POST',
      body: JSON.stringify(note),
    });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to create diary note on backend');
  }

  async updateDiaryNote(
    id: string,
    updates: {
      content?: string;
      crop?: string;
      cropId?: string;
      date?: string;
      source?: 'text' | 'voice' | 'TEXT' | 'VOICE';
    }
  ): Promise<any> {
    const res = await this.request(`/diary/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update diary note on backend');
  }

  async deleteDiaryNote(id: string): Promise<boolean> {
    const res = await this.request(`/diary/${id}`, {
      method: 'DELETE',
    });
    if (res.success) {
      return true;
    }
    throw new Error(res.message || 'Failed to delete diary note on backend');
  }

  // ---------------------------------------------------------------------------
  // AI ASSISTANT & AGRO-ADVISORY (GEMINI POWERED)
  // ---------------------------------------------------------------------------

  async askAiAssistant(
    query: string,
    language = 'mr',
    context?: {
      farmerName?: string;
      location?: string;
      crops?: string[];
      landArea?: string;
    }
  ): Promise<string> {
    try {
      const res = await this.request<{ answer: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: query,
          language,
          context,
        }),
      });

      if (res.success && res.data?.answer) {
        return res.data.answer;
      }
    } catch (err) {
      console.warn('[ApiService] Backend AI Chat warning:', err);
    }

    // Direct client fallback to Gemini API (models confirmed working 2026-09-01)
    const GEMINI_DIRECT_MODELS = [
      'gemini-3.6-flash',
      'gemini-3.7-flash',
      'gemini-3.5-flash',
      'gemini-flash-latest',
      'gemini-3.5-flash-lite',
    ];
    const clientKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

    for (const model of GEMINI_DIRECT_MODELS) {
      try {
        const langInstr =
          language === 'mr'
            ? 'Respond in clear, natural Marathi (मराठी) using Devanagari script.'
            : language === 'hi'
            ? 'Respond in clear, helpful Hindi (हिंदी) using Devanagari script.'
            : 'Respond in clear, professional English.';

        const promptText = `You are SmartShetkari AI, an expert agricultural advisor for Indian farmers.\n${langInstr}\n\nFarmer Query: ${query}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${clientKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: promptText }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
            }),
          }
        );

        if (geminiRes.ok) {
          const gData = await geminiRes.json();
          const ans = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (ans && ans.trim().length > 0) {
            return ans.trim();
          }
        }
      } catch (gemErr) {
        console.warn(`[ApiService] Direct Gemini query warning (${model}):`, gemErr);
      }
    }

    // Smart fallback if network is completely down
    return language === 'mr'
      ? `🌿 **स्मार्टशेतकरी कृषी सल्ला:**\nतुमच्या "${query}" या प्रश्नासाठी: पिकाची नियमित पाहणी करून मातीतील ओलावा तपासावा. योग्य प्रमाणात जैविक कीटकनाशके व खते वापरावीत.`
      : language === 'hi'
      ? `🌿 **स्मार्ट किसान सलाह:**\nआपके प्रश्न "${query}" के अनुसार: फसल में संतुलित पोषण प्रबंधन रखें और सिंचाई का सही समय निर्धारित करें।`
      : `🌿 **SmartShetkari Advisory:**\nFor "${query}": Monitor crop foliage regularly and ensure optimal irrigation and balanced nutrition.`;
  }

  // ---------------------------------------------------------------------------
  // BILL OCR & STORAGE METHODS
  // ---------------------------------------------------------------------------

  async scanBillOcr(payload: { imageBase64: string; mimeType?: string }): Promise<{
    vendorName: string | null;
    vendorPhone: string | null;
    vendorAddress: string | null;
    invoiceNumber: string | null;
    billDate: string | null;
    items: Array<{
      name: string;
      quantity: number;
      unit: string;
      price: number;
      amount: number;
    }>;
    tax: number | null;
    discount: number | null;
    totalAmount: number | null;
    category: string | null;
    rawText: string;
  }> {
    const res = await this.request('/bills/ocr-scan', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to scan and extract bill information');
  }

  async saveBill(payload: {
    imageBase64?: string;
    mimeType?: string;
    vendorName: string;
    vendorPhone?: string | null;
    vendorAddress?: string | null;
    invoiceNumber?: string | null;
    billDate: string;
    totalAmount: number;
    rawOcrText?: string | null;
    expenseTitle?: string;
    expenseCategory?: string;
    expenseCrop?: string;
    expenseCropId?: string;
    expensePaymentMode?: string;
    expenseNotes?: string;
  }): Promise<{ bill: any; expense: any }> {
    const res = await this.request('/bills/save', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to save bill and record expense');
  }

  async getBills(): Promise<any[]> {
    const res = await this.request('/bills', { method: 'GET' });
    if (res.success && res.data?.items) {
      return res.data.items;
    }
    throw new Error(res.message || 'Failed to fetch bills');
  }

  async deleteBill(id: string): Promise<boolean> {
    const res = await this.request(`/bills/${id}`, {
      method: 'DELETE',
    });
    if (res.success) {
      return true;
    }
    throw new Error(res.message || 'Failed to delete bill');
  }

  // ---------------------------------------------------------------------------
  // MAHARASHTRA LOCATION MASTER DATA APIS
  // ---------------------------------------------------------------------------

  async getDistricts(stateCode = 'MH'): Promise<Array<{
    id: string;
    code: string;
    nameEn: string;
    nameMr: string;
    nameHi: string | null;
    stateCode: string;
  }>> {
    const res = await this.request(
      `/locations/districts?stateCode=${encodeURIComponent(stateCode)}`,
      { method: 'GET' },
      15 * 60 * 1000 // 15-minute cache
    );
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  }

  async getTalukas(districtId: string): Promise<Array<{
    id: string;
    code: string;
    nameEn: string;
    nameMr: string;
    nameHi: string | null;
    districtId: string;
  }>> {
    const res = await this.request(
      `/locations/districts/${encodeURIComponent(districtId)}/talukas`,
      { method: 'GET' },
      15 * 60 * 1000 // 15-minute cache
    );
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  }

  async getVillages(
    talukaId: string,
    search?: string,
    page = 1,
    limit = 100
  ): Promise<{
    villages: Array<{
      id: string;
      code: string;
      nameEn: string;
      nameMr: string;
      nameHi: string | null;
      talukaId: string;
    }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) queryParams.append('search', search);

    const res = await this.request(`/locations/talukas/${encodeURIComponent(talukaId)}/villages?${queryParams.toString()}`, {
      method: 'GET',
    });
    if (res.success && res.data) {
      return res.data;
    }
    return {
      villages: [],
      pagination: { total: 0, page: 1, limit, totalPages: 0 },
    };
  }

  async searchVillages(
    query: string,
    talukaId?: string,
    districtId?: string
  ): Promise<Array<{
    id: string;
    code: string;
    nameEn: string;
    nameMr: string;
    nameHi: string | null;
    taluka?: {
      id: string;
      nameEn: string;
      nameMr: string;
      district?: {
        id: string;
        nameEn: string;
        nameMr: string;
      };
    };
  }>> {
    const queryParams = new URLSearchParams({ q: query });
    if (talukaId) queryParams.append('talukaId', talukaId);
    if (districtId) queryParams.append('districtId', districtId);

    const res = await this.request(`/locations/search?${queryParams.toString()}`, {
      method: 'GET',
    });
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  }
}

export const api = new ApiService();



