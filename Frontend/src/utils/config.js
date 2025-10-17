/**
 * Environment configuration utility
 * Access environment variables with type safety and default values
 */

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    version: import.meta.env.VITE_API_VERSION || '/api/v1',
    rateLimit: Number(import.meta.env.VITE_API_RATE_LIMIT || 100),
    rateLimitInterval: Number(import.meta.env.VITE_API_RATE_LIMIT_INTERVAL || 60000),
  },
  auth: {
    tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'documind_auth_token',
  },
  features: {
    darkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
    debugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  },
  // Add other configuration sections as needed
};

/**
 * Validate required environment variables
 * Throws an error if any required variables are missing
 */
export const validateEnvVariables = () => {
  const required = [
    'VITE_API_BASE_URL',
    'VITE_API_VERSION',
    'VITE_AUTH_TOKEN_KEY',
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      'Please check your .env file.'
    );
  }
};