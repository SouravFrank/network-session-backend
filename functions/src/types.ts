export interface UsageData {
  loginTime: string;
  sessionTime: string;
  download: number;
  upload: number;
}

// Define types for request bodies and responses
export interface UpdateNetworkUsageRequestBody {
  html: string;
}

export interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
  error?: string;
}
