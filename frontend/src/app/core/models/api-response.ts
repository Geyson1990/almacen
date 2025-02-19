export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<any>
}


export interface ApiResponseCase<T> {
  Success: boolean;
  Message: string;
  Data: T;  
}