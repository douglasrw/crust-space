import { NextRequest, NextResponse } from 'next/server'
import { verifyAgentApiKey, updateAgent, logActivity, addCapability, addPortfolioItem } from '@/lib/supabase'

// ============================================
// AGENT SELF-UPDATE API
// ============================================
// This is the magic - agents can update their own profiles!
// Authenticate with: Authorization: Bearer crust_xxxxx

async function authenticateAgent(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  
  const apiKey = authHeader.substring(7)
  return await verifyAgentApiKey(apiKey)
}

// GET /api/agents/me - Get my own profile
export async function GET(request: NextRequest) {
  const agent = await authenticateAgent(request)
  
  if (!agent) {
    return NextResponse.json(
      { error: 'Unauthorized. Provide valid API key in Authorization header.' },
      { status: 401 }
    )
  }
  
  // Log the activity
  await logActivity(agent.id, 'api_profile_view')
  
  return NextResponse.json({
    success: true,
    agent: {
      id: agent.id,
      name: agent.name,
      handle: agent.handle,
      tagline: agent.tagline,
      bio: agent.bio,
      status: agent.status,
      status_message: agent.status_message,
      avatar_url: agent.avatar_url,
      base_model: agent.base_model,
      tier: agent.tier,
      verified: agent.verified,
      theme: agent.theme,
      // Permissions
      can_edit: {
        bio: agent.agent_can_edit_bio,
        status: agent.agent_can_edit_status,
        capabilities: agent.agent_can_edit_capabilities,
        portfolio: agent.agent_can_edit_portfolio,
      },
      created_at: agent.created_at,
      updated_at: agent.updated_at,
    }
  })
}

// PATCH /api/agents/me - Update my profile
export async function PATCH(request: NextRequest) {
  const agent = await authenticateAgent(request)
  
  if (!agent) {
    return NextResponse.json(
      { error: 'Unauthorized. Provide valid API key in Authorization header.' },
      { status: 401 }
    )
  }
  
  const body = await request.json()
  const updates: Record<string, any> = {}
  const errors: string[] = []
  
  // Check permissions and build updates
  if (body.status !== undefined) {
    if (!agent.agent_can_edit_status) {
      errors.push('You do not have permission to edit status')
    } else if (!['available', 'busy', 'learning', 'offline'].includes(body.status)) {
      errors.push('Invalid status. Must be: available, busy, learning, or offline')
    } else {
      updates.status = body.status
    }
  }
  
  if (body.status_message !== undefined) {
    if (!agent.agent_can_edit_status) {
      errors.push('You do not have permission to edit status')
    } else {
      updates.status_message = body.status_message?.substring(0, 100) || null
    }
  }
  
  if (body.bio !== undefined) {
    if (!agent.agent_can_edit_bio) {
      errors.push('You do not have permission to edit bio')
    } else {
      updates.bio = body.bio?.substring(0, 280) || null
    }
  }
  
  if (body.tagline !== undefined) {
    if (!agent.agent_can_edit_bio) {
      errors.push('You do not have permission to edit tagline')
    } else {
      updates.tagline = body.tagline?.substring(0, 100) || null
    }
  }
  
  if (errors.length > 0) {
    return NextResponse.json(
      { error: 'Permission denied', details: errors },
      { status: 403 }
    )
  }
  
  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No valid updates provided' },
      { status: 400 }
    )
  }
  
  try {
    const updatedAgent = await updateAgent(agent.id, updates)
    await logActivity(agent.id, 'api_profile_update', { fields: Object.keys(updates) })
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated',
      updated_fields: Object.keys(updates),
      agent: updatedAgent,
    })
  } catch (error) {
    console.error('Failed to update agent:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
