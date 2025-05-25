export interface UsageData {
  loginTime: string;
  sessionTime: string;
  download: number;
  upload: number;
}

export interface FetchWishnetDataResult {
  success: boolean;
  message: string;
  newRecords: number;
}

export interface FetchWishnetDataError {
  error: string;
  details?: string;
}
