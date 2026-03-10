
export interface User {
  id: string;
  email: string;
  name: string;
  companyName?: string;
  logoUrl?: string;
  phone?: string;
  address?: string;
  timezone?: string;
  currency?: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  token?: string;
  message?: string;
}

