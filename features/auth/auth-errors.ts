/**
 * Auth Error Code Translations (Vietnamese)
 * Maps error codes from backend to user-friendly Vietnamese messages
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Phone errors
  INVALID_PHONE: "Số điện thoại không hợp lệ theo định dạng Việt Nam",
  PHONE_ALREADY_EXISTS: "Số điện thoại này đã được đăng ký",
  PHONE_NOT_FOUND: "Không tìm thấy người dùng với số điện thoại này",
  PHONE_ALREADY_VERIFIED: "Số điện thoại đã được xác thực",
  PHONE_NOT_VERIFIED: "Số điện thoại chưa được xác thực",

  // Email errors
  EMAIL_REQUIRED: "Vui lòng nhập email",
  EMAIL_INVALID: "Email không đúng định dạng",
  EMAIL_ALREADY_EXISTS: "Email này đã được đăng ký",
  EMAIL_NOT_FOUND: "Không tìm thấy tài khoản với email này",
  EMAIL_ALREADY_VERIFIED: "Email đã được xác thực",
  EMAIL_NOT_VERIFIED: "Email chưa được xác thực",

  // Name errors
  NAME_REQUIRED: "Vui lòng nhập họ và tên",
  NAME_LENGTH_INVALID: "Họ và tên phải có độ dài từ 2 đến 100 ký tự",

  // Password errors
  PASSWORD_REQUIRED: "Vui lòng nhập mật khẩu",
  PASSWORD_FORMAT_INVALID:
    "Mật khẩu phải có ít nhất 6 ký tự, bao gồm cả chữ và số",
  PASSWORD_MISMATCH: "Mật khẩu không khớp",

  // Location errors
  PROVINCE_REQUIRED: "Vui lòng chọn Tỉnh/Thành phố",
  DISTRICT_REQUIRED: "Vui lòng chọn Quận/Huyện",
  WARD_REQUIRED: "Vui lòng chọn Phường/Xã",
  LOCATION_CODE_INVALID: "Mã địa điểm không hợp lệ",

  // Account errors
  ACCOUNT_CONFLICT:
    "Thông tin đăng ký thuộc về hai tài khoản khác nhau. Vui lòng sử dụng thông tin khác.",
  ACCOUNT_BANNED: "Tài khoản đã bị khóa",
  INVALID_CREDENTIALS: "Số điện thoại hoặc mật khẩu không chính xác",

  // OTP errors
  OTP_REQUIRED: "Vui lòng nhập mã OTP",
  OTP_INVALID_FORMAT: "Mã OTP phải là 6 chữ số",
  OTP_INVALID: "Mã OTP không hợp lệ",
  OTP_EXPIRED: "Mã OTP đã hết hạn",
  OTP_INVALID_OR_EXPIRED: "Mã OTP không hợp lệ hoặc đã hết hạn",
  OTP_RESEND_TOO_SOON: "Vui lòng đợi trước khi yêu cầu mã OTP mới",

  // Token errors
  REFRESH_TOKEN_INVALID: "Refresh token không hợp lệ hoặc đã hết hạn",
  REFRESH_TOKEN_MISMATCH: "Refresh token không được hệ thống nhận dạng",
  
  // User errors
  USER_NOT_FOUND: "Không tìm thấy người dùng",
};

/**
 * Success Message Translations (Vietnamese)
 * Maps common success messages from backend to Vietnamese
 */
export const AUTH_SUCCESS_MESSAGES: Record<string, string> = {
  "Registration successful. Please verify your email with the OTP.":
    "Đăng ký thành công. Vui lòng xác thực email bằng mã OTP.",
  "Email verification successful":
    "Xác thực email thành công",
  "Phone verification successful":
    "Xác thực số điện thoại thành công",
  "OTP resent successfully":
    "Gửi lại mã OTP thành công",
  "Login successful":
    "Đăng nhập thành công",
  "Logout successful":
    "Đăng xuất thành công",
  "If the email exists, the password reset OTP has been sent.":
    "Nếu email tồn tại, mã OTP đặt lại mật khẩu đã được gửi.",
  "Password reset successful":
    "Đặt lại mật khẩu thành công",
};

/**
 * Get translated error message from error code
 * Falls back to original message if no translation exists
 */
export const getAuthErrorMessage = (
  errorCode?: string,
  fallbackMessage?: string
): string => {
  if (!errorCode) {
    return fallbackMessage || "Đã xảy ra lỗi. Vui lòng thử lại.";
  }

  return (
    AUTH_ERROR_MESSAGES[errorCode] ||
    fallbackMessage ||
    "Đã xảy ra lỗi. Vui lòng thử lại."
  );
};

/**
 * Get translated success message
 * Falls back to original message if no translation exists
 */
export const getAuthSuccessMessage = (message: string): string => {
  return AUTH_SUCCESS_MESSAGES[message] || message;
};
