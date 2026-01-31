// Environment configuration with validation and defaults
// This ensures the app fails gracefully if environment variables are missing

export interface AppConfig {
  supabase: {
    url: string
    anonKey: string
    serviceRoleKey?: string
  }
  app: {
    name: string
    url: string
    isDevelopment: boolean
    isProduction: boolean
  }
  features: {
    authEnabled: boolean
    databaseEnabled: boolean
    analyticsEnabled: boolean
  }
}

function getEnvVar(key: string, defaultValue?: string, required = true): string {
  const value = process.env[key] || defaultValue

  if (required && !value) {
    throw new Error(`Environment variable ${key} is required but not provided`)
  }

  return value || ''
}

function isPlaceholder(value: string): boolean {
  return value.includes('placeholder') || value.includes('your-project') || value.includes('your-')
}

// Parse and validate environment variables
function createConfig(): AppConfig {
  const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL', '', false)
  const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', '', false)
  const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY', '', false)

  // Check if we have valid (non-placeholder) Supabase credentials
  const databaseEnabled = !!(
    supabaseUrl &&
    supabaseAnonKey &&
    !isPlaceholder(supabaseUrl) &&
    !isPlaceholder(supabaseAnonKey)
  )

  return {
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
      serviceRoleKey: supabaseServiceKey,
    },
    app: {
      name: 'Crust-Space',
      url: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000', false),
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production',
    },
    features: {
      authEnabled: databaseEnabled, // Auth requires working database
      databaseEnabled,
      analyticsEnabled: !!getEnvVar('NEXT_PUBLIC_POSTHOG_KEY', '', false),
    },
  }
}

// Export singleton config
export const config = createConfig()

// Helper functions
export function isDatabaseConfigured(): boolean {
  return config.features.databaseEnabled
}

export function isAuthConfigured(): boolean {
  return config.features.authEnabled
}

export function getSupabaseConfig() {
  if (!config.features.databaseEnabled) {
    throw new Error('Database is not configured. Check your SUPABASE_* environment variables.')
  }

  return {
    url: config.supabase.url,
    anonKey: config.supabase.anonKey,
    serviceRoleKey: config.supabase.serviceRoleKey,
  }
}

// Development helpers
export function getConfigStatus() {
  return {
    database: config.features.databaseEnabled ? '✅ Configured' : '❌ Missing/Invalid',
    auth: config.features.authEnabled ? '✅ Enabled' : '❌ Disabled',
    analytics: config.features.analyticsEnabled ? '✅ Enabled' : '❌ Disabled',
    environment: config.app.isDevelopment ? 'Development' : 'Production',
  }
}

// Log configuration status in development
if (config.app.isDevelopment) {
  console.log('🦀 Crust-Space Configuration:')
  console.table(getConfigStatus())

  if (!config.features.databaseEnabled) {
    console.warn(
      '⚠️  Database not configured. Using mock data.\n' +
      '   Set up Supabase and update your .env.local file to enable real data.\n' +
      '   See README.md for setup instructions.'
    )
  }
}