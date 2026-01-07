enum UserConstant {
  // ✅ USER CRUD OPERATIONS

  CREATE_USER_SUCCESS = 'User created successfully',
  UPDATE_USER_SUCCESS = 'User updated successfully',
  DELETE_USER_SUCCESS = 'User deleted successfully',
  GET_USER_SUCCESS = 'User fetched successfully',
  GET_ALL_USERS_SUCCESS = 'All users fetched successfully',

  CREATE_USER_FAILED = 'Failed to create user',
  UPDATE_USER_FAILED = 'Failed to update user',
  DELETE_USER_FAILED = 'Failed to delete user',
  GET_USER_FAILED = 'Failed to fetch user',
  GET_ALL_USERS_FAILED = 'Failed to fetch users',

  // ✅ AUTHENTICATION & REGISTRATION

  REGISTER_USER_SUCCESS = 'User registered successfully',
  LOGIN_USER_SUCCESS = 'User logged in successfully',
  USER_PROFILE_SUCCESS = 'User profile fetched successfully',
  GENERATE_API_KEY_SUCCESS = 'API key generated successfully',
  PASSWORD_CHANGED_SUCCESS = 'Password changed successfully',
  PASSWORD_RESET_SUCCESS = 'Password reset successfully',
  EMAIL_VERIFIED_SUCCESS = 'Email verified successfully',

  REGISTER_USER_FAILED = 'Failed to register user',
  LOGIN_USER_FAILED = 'Invalid email or password',
  USER_PROFILE_FAILED = 'Failed to fetch user profile',
  GENERATE_API_KEY_FAILED = 'Failed to generate API key',
  PASSWORD_CHANGED_FAILED = 'Failed to change password',
  PASSWORD_RESET_FAILED = 'Failed to reset password',
  EMAIL_VERIFIED_FAILED = 'Failed to verify email',

  // ✅ PASSWORD VALIDATION & ERRORS

  PASSWORD_REQUIRED = 'Password is required',
  INVALID_PASSWORD = 'Invalid password',
  PASSWORD_UNDEFINED = 'Provided password is undefined',

  PASSWORD_MIN_LENGTH = 'Password must be at least 8 characters',
  PASSWORD_MAX_LENGTH = 'Password must be at most 20 characters',
  PASSWORD_UPPERCASE_REQUIRED = 'Password must contain at least one uppercase letter',
  PASSWORD_LOWERCASE_REQUIRED = 'Password must contain at least one lowercase letter',
  PASSWORD_NUMBER_REQUIRED = 'Password must contain at least one number',
  PASSWORD_SPECIAL_CHAR_REQUIRED = 'Password must contain at least one special character',

  // ✅ TOKEN & AUTHORIZATION ERRORS

  TOKEN_MISSING = 'Authentication token missing',
  INVALID_TOKEN = 'Invalid token',
  UNAUTHORIZED = 'Unauthorized access',
  FORBIDDEN = 'Forbidden access',

  // ✅ USER & INPUT VALIDATION
  USER_NOT_FOUND = 'User not found',
  EMAIL_ALREADY_EXISTS = 'Email already exists',
  INVALID_INPUT = 'User is not available in request',
  INVALID_CREDENTIALS = 'Invalid credentials',
  NAME_REQUIRED = 'Name is required!',
  FIRST_NAME_REQUIRED = 'First name is required',
  BIRTH_PLACE_REQUIRED = 'Birth place is required',
  LOCATION_REQUIRED = 'Location is required',
  INVALID_ROLE = 'Invalid user role',
  INVALID_PORTFOLIO_URL = 'Portfolio URL is invalid',
  BIO_TOO_LONG = 'Bio exceeds the maximum allowed length',

  // ✅ DATABASE & SERVER ERRORS

  DATABASE_FIND_USER_ERROR = 'Database error while finding user by email',
  SERVER_ERROR = 'Something went wrong, please try again later',

  // 🧩 API Key Related
  API_KEY_CREATED = 'API key created successfully',
  API_KEY_CREATION_FAILED = 'Failed to create API key',

  API_KEY_FETCHED = 'API key fetched successfully',
  API_KEY_NOT_FOUND = 'API key not found',

  API_KEY_VERIFICATION_SENT = 'Verification email sent successfully',
  FAILED_TO_SEND_EMAIL = 'Failed to send verification email',

  API_KEY_VERIFICATION_SUCCESS = 'API key verification successful',
  API_KEY_VERIFICATION_FAILED = 'Invalid or expired verification code',

  API_KEY_REVEALED = 'API key revealed successfully',
  API_KEY_REVEAL_FAILED = 'Failed to reveal API key',
}

export default UserConstant

export const AllowedUserRoles = ['user', 'admin', 'creator'] as const

export const PasswordConfig = {
  minLength: 8,
  maxLength: 128,
  saltRounds: 10,
}

export const BioConfig = {
  maxLength: 500,
}
