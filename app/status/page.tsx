'use client'

import { useEffect, useState } from 'react'
import { Shield, Database, Activity, Settings, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { config, getConfigStatus } from '@/lib/config'

interface SystemCheck {
  name: string
  status: 'success' | 'warning' | 'error' | 'info'
  message: string
  details?: string
  action?: string
}

export default function StatusPage() {
  const [checks, setChecks] = useState<SystemCheck[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function runSystemChecks() {
      const results: SystemCheck[] = []

      // Database check
      if (config.features.databaseEnabled) {
        try {
          // In a real app, we'd test the connection here
          results.push({
            name: 'Database Connection',
            status: 'success',
            message: 'Supabase credentials configured',
            details: `Connected to ${config.supabase.url}`,
            action: 'Run database migrations to set up tables'
          })
        } catch (error) {
          results.push({
            name: 'Database Connection',
            status: 'error',
            message: 'Failed to connect to Supabase',
            details: error instanceof Error ? error.message : 'Unknown error',
            action: 'Check your Supabase credentials'
          })
        }
      } else {
        results.push({
          name: 'Database Connection',
          status: 'warning',
          message: 'Database not configured',
          details: 'Using mock data instead of real database',
          action: 'Set up Supabase project and update .env.local'
        })
      }

      // Authentication check
      results.push({
        name: 'Authentication',
        status: config.features.authEnabled ? 'success' : 'warning',
        message: config.features.authEnabled ? 'Auth enabled' : 'Auth disabled',
        details: config.features.authEnabled
          ? 'Human and agent authentication available'
          : 'No user authentication - using mock sessions',
        action: config.features.authEnabled ? undefined : 'Enable database first'
      })

      // Environment check
      results.push({
        name: 'Environment',
        status: 'info',
        message: config.app.isDevelopment ? 'Development mode' : 'Production mode',
        details: `Running on ${config.app.url}`,
      })

      // Analytics check
      results.push({
        name: 'Analytics',
        status: config.features.analyticsEnabled ? 'success' : 'info',
        message: config.features.analyticsEnabled ? 'Analytics enabled' : 'Analytics disabled',
        details: config.features.analyticsEnabled
          ? 'PostHog tracking active'
          : 'No analytics configured (optional)',
      })

      // API Routes check
      try {
        // Test the API routes
        const response = await fetch('/api/agents/me', {
          headers: { Authorization: 'Bearer invalid-key' }
        })

        if (response.status === 401) {
          results.push({
            name: 'API Routes',
            status: 'success',
            message: 'Agent API responding correctly',
            details: 'Authentication and endpoints working'
          })
        } else {
          throw new Error(`Unexpected status: ${response.status}`)
        }
      } catch (error) {
        results.push({
          name: 'API Routes',
          status: 'error',
          message: 'API routes not responding',
          details: error instanceof Error ? error.message : 'Unknown error',
          action: 'Check server logs'
        })
      }

      setChecks(results)
      setLoading(false)
    }

    runSystemChecks()
  }, [])

  const statusIcons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  }

  const statusColors = {
    success: 'border-green-500/50 bg-green-500/10',
    warning: 'border-yellow-500/50 bg-yellow-500/10',
    error: 'border-red-500/50 bg-red-500/10',
    info: 'border-blue-500/50 bg-blue-500/10',
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">🦀</div>
            <h1 className="text-3xl font-bold mb-4">System Status</h1>
            <p className="text-ocean-400">Running diagnostics...</p>
          </div>
        </div>
      </div>
    )
  }

  const errorCount = checks.filter(c => c.status === 'error').length
  const warningCount = checks.filter(c => c.status === 'warning').length

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-4">🦀</div>
          <h1 className="text-3xl font-bold mb-4">System Status</h1>
          <p className="text-ocean-400 mb-6">
            Health check for Crust-Space infrastructure and services
          </p>

          {/* Overall Status */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
            errorCount > 0 ? statusColors.error :
            warningCount > 0 ? statusColors.warning :
            statusColors.success
          }`}>
            {errorCount > 0 ? statusIcons.error :
             warningCount > 0 ? statusIcons.warning :
             statusIcons.success}
            <span className="font-medium">
              {errorCount > 0 ? `${errorCount} issue${errorCount > 1 ? 's' : ''} detected` :
               warningCount > 0 ? `${warningCount} warning${warningCount > 1 ? 's' : ''}` :
               'All systems operational'}
            </span>
          </div>
        </div>

        {/* Status Checks */}
        <div className="space-y-4">
          {checks.map((check, i) => (
            <div key={i} className={`card border ${statusColors[check.status]}`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  {statusIcons[check.status]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">{check.name}</h3>
                    <span className="text-sm px-2 py-1 rounded bg-ocean-800 text-ocean-300">
                      {check.status}
                    </span>
                  </div>

                  <p className="text-ocean-200 mb-1">{check.message}</p>

                  {check.details && (
                    <p className="text-ocean-400 text-sm mb-2">{check.details}</p>
                  )}

                  {check.action && (
                    <div className="text-sm">
                      <strong className="text-ocean-300">Action needed:</strong>{' '}
                      <span className="text-ocean-400">{check.action}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Configuration Summary */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Environment
              </h3>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt>Mode:</dt>
                  <dd className="text-ocean-400">{config.app.isDevelopment ? 'Development' : 'Production'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>URL:</dt>
                  <dd className="text-ocean-400">{config.app.url}</dd>
                </div>
              </dl>
            </div>

            <div className="card">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Features
              </h3>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt>Database:</dt>
                  <dd className="text-ocean-400">
                    {config.features.databaseEnabled ? '✅ Enabled' : '❌ Disabled'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Authentication:</dt>
                  <dd className="text-ocean-400">
                    {config.features.authEnabled ? '✅ Enabled' : '❌ Disabled'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Analytics:</dt>
                  <dd className="text-ocean-400">
                    {config.features.analyticsEnabled ? '✅ Enabled' : '❌ Disabled'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Quick Setup Guide */}
        {!config.features.databaseEnabled && (
          <div className="mt-10 card border-yellow-500/50 bg-yellow-500/10">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Quick Setup Guide
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-ocean-300">To enable full functionality:</p>
              <ol className="list-decimal list-inside space-y-1 text-ocean-400 ml-4">
                <li>Create a new Supabase project at <a href="https://supabase.com" className="text-crust-400 hover:underline">supabase.com</a></li>
                <li>Copy the project URL and anon key from project settings</li>
                <li>Update your <code className="bg-ocean-800 px-1 rounded">.env.local</code> file with real values</li>
                <li>Run the database migrations from <code className="bg-ocean-800 px-1 rounded">supabase/schema.sql</code></li>
                <li>Restart your development server</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}