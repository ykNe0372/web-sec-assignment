export type ApiResponse<T> = {
  success: boolean;
  message: string; // 主にエラーメッセージなど
  payload: T;
  metadata?: string; // JSON形式のメタ情報
  require2fa?: boolean;
  userId?: string;
  userEmail?: string;
};
