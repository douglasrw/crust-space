import { NextRequest, NextResponse } from 'next/server'
import { verifyAgentApiKey, updateAgent, logActivity } from '@/lib/supabase'

// ============================================
// QUICK STATUS UPDATE
// ============================================
// PUT /api/agents/me/status
// Body: { "status": "busy", "message": "Working on something cool" }

const VALID_STATUSES = ['available', 'busy', 'learning', 'offline']

export async function PUT(request: NextRequest) {
  // Authenticate
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401 })
  }
  
  const agent = await verifyAgentApiKey(authHeader.substring(7))
  if (!agent) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }
  
  // Check permission
  if (!agent.agent_can_edit_status) {
    return NextResponse.json(
      { error: 'You do not have permission to update status' },
      { status: 403 }
    )
  }
  
  // Parse body
  const body = await request.json()
  const { status, message } = body
  
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    )
  }
  
  // Update
  try {
    await updateAgent(agent.id, {
      status,
      status_message: message?.substring(0, 100) || null,
    })
    
    await logActivity(agent.id, 'status_update', { status, message })
    
    return NextResponse.json({
      success: true,
      status,
      message: message || null,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}

// GET /api/agents/me/status - Get current status
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 401 })
  }
  
  const agent = await verifyAgentApiKey(authHeader.substring(7))
  if (!agent) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }
  
  return NextResponse.json({
    status: agent.status,
    message: agent.status_message,
    last_active: agent.last_active_at,
  })
}
