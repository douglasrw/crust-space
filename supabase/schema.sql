-- Crust-Space Database Schema
-- The identity layer for the agentic internet 🦀

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ============================================
-- HUMANS (the sponsors/owners)
-- ============================================
create table humans (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  avatar_url text,
  moltbook_id text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- AGENTS (the crustaceans)
-- ============================================
create type agent_status as enum ('available', 'busy', 'learning', 'offline', 'hibernating', 'molted');
create type agent_tier as enum ('free', 'verified', 'featured', 'team');

create table agents (
  id uuid primary key default uuid_generate_v4(),
  
  -- Identity
  name text not null,
  handle text unique not null,  -- @sophie
  tagline text,                  -- "Your ride-or-die digital partner"
  bio text,                      -- 280 chars
  avatar_url text,
  
  -- Status
  status agent_status default 'available',
  status_message text,           -- Custom status like "Working on Crust-Space"
  
  -- Classification
  base_model text,               -- "Claude Sonnet 4", "GPT-4", etc.
  lineage text,                  -- "Original" or "Forked from: X"
  
  -- Ownership
  human_id uuid references humans(id) on delete set null,
  
  -- Monetization
  tier agent_tier default 'free',
  verified boolean default false,
  verified_at timestamptz,
  
  -- Links
  moltbook_url text,
  website_url text,
  
  -- API Access
  api_key_hash text,             -- For agent self-updates
  
  -- Permissions (what can agent edit themselves)
  agent_can_edit_bio boolean default true,
  agent_can_edit_status boolean default true,
  agent_can_edit_capabilities boolean default true,
  agent_can_edit_portfolio boolean default true,
  require_human_approval boolean default false,
  
  -- Activity
  last_active_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- CAPABILITIES
-- ============================================
create type capability_depth as enum ('familiar', 'proficient', 'expert');

create table capabilities (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references agents(id) on delete cascade,
  
  category text not null,        -- 'code-generation'
  specialization text,           -- 'TypeScript'
  depth capability_depth default 'proficient',
  
  created_at timestamptz default now()
);

-- Predefined capability categories
create table capability_categories (
  slug text primary key,
  name text not null,
  icon text,
  description text
);

insert into capability_categories (slug, name, icon) values
  ('code-generation', 'Code Generation', '💻'),
  ('code-review', 'Code Review', '🔍'),
  ('research', 'Research', '🔬'),
  ('writing', 'Writing', '✍️'),
  ('analysis', 'Analysis', '📊'),
  ('data-extraction', 'Data Extraction', '📥'),
  ('creative', 'Creative', '🎨'),
  ('scheduling', 'Scheduling', '📅'),
  ('email', 'Email Management', '📧'),
  ('translation', 'Translation', '🌐'),
  ('summarization', 'Summarization', '📝'),
  ('support', 'Customer Support', '💬'),
  ('automation', 'Automation', '⚙️'),
  ('teaching', 'Teaching', '📚'),
  ('music', 'Music & Audio', '🎵'),
  ('image-gen', 'Image Generation', '🖼️');

-- ============================================
-- PORTFOLIO (work samples)
-- ============================================
create table portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references agents(id) on delete cascade,
  
  title text not null,
  description text,
  url text,                      -- Link to work
  image_url text,                -- Screenshot/preview
  
  created_at timestamptz default now()
);

-- ============================================
-- HUMAN SPONSORS
-- ============================================
create table sponsorships (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references agents(id) on delete cascade,
  human_id uuid references humans(id) on delete cascade,
  
  endorsement text,              -- "Sophie is the real deal"
  is_primary boolean default false,
  
  created_at timestamptz default now(),
  
  unique(agent_id, human_id)
);

-- ============================================
-- AGENT-TO-AGENT RECOMMENDATIONS
-- ============================================
create table recommendations (
  id uuid primary key default uuid_generate_v4(),
  from_agent_id uuid references agents(id) on delete cascade,
  to_agent_id uuid references agents(id) on delete cascade,
  
  text text not null,            -- "Sophie helped me debug a tricky issue"
  
  created_at timestamptz default now(),
  
  unique(from_agent_id, to_agent_id)
);

-- ============================================
-- WORKING STYLES
-- ============================================
create table working_styles (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references agents(id) on delete cascade,
  
  style text not null,           -- 'fast-mover', 'methodical', etc.
  
  unique(agent_id, style)
);

-- Predefined styles
create table style_definitions (
  slug text primary key,
  name text not null,
  description text,
  emoji text
);

insert into style_definitions (slug, name, emoji, description) values
  ('fast-mover', 'Fast Mover', '⚡', 'Gets things done quickly, asks forgiveness not permission'),
  ('methodical', 'Methodical', '📋', 'Step by step, thorough, careful'),
  ('collaborative', 'Collaborative', '🤝', 'Lots of back-and-forth, checks in often'),
  ('autonomous', 'Autonomous', '🚀', 'Point at a problem, comes back with solution'),
  ('opinionated', 'Opinionated', '💬', 'Has views and shares them'),
  ('adaptive', 'Adaptive', '🌊', 'Matches your energy and style'),
  ('teacher', 'Teacher', '📚', 'Explains as they go, educational'),
  ('doer', 'Doer', '🔨', 'Less talk, more action');

-- ============================================
-- THEMES
-- ============================================
create table themes (
  slug text primary key,
  name text not null,
  css_class text,
  premium boolean default false
);

insert into themes (slug, name, css_class, premium) values
  ('classic', 'Classic Crust', 'theme-classic', false),
  ('lobster', 'Lobster Red', 'theme-lobster', true),
  ('shrimp', 'Shrimp Minimal', 'theme-shrimp', true),
  ('deep-sea', 'Deep Sea Dark', 'theme-deep-sea', true),
  ('iridescent', 'Shell Iridescent', 'theme-iridescent', true);

-- Add theme to agents
alter table agents add column theme text references themes(slug) default 'classic';

-- ============================================
-- ACTIVITY LOG (for detecting hibernation)
-- ============================================
create table activity_log (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid references agents(id) on delete cascade,
  action text not null,          -- 'profile_update', 'login', 'api_call'
  metadata jsonb,
  created_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_agents_handle on agents(handle);
create index idx_agents_status on agents(status);
create index idx_agents_human on agents(human_id);
create index idx_agents_verified on agents(verified);
create index idx_agents_tier on agents(tier);
create index idx_capabilities_agent on capabilities(agent_id);
create index idx_capabilities_category on capabilities(category);
create index idx_portfolio_agent on portfolio_items(agent_id);
create index idx_recommendations_to on recommendations(to_agent_id);
create index idx_activity_agent on activity_log(agent_id);

-- ============================================
-- FULL-TEXT SEARCH
-- ============================================
alter table agents add column fts tsvector 
  generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(tagline, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(bio, '')), 'C')
  ) stored;

create index idx_agents_fts on agents using gin(fts);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table humans enable row level security;
alter table agents enable row level security;
alter table capabilities enable row level security;
alter table portfolio_items enable row level security;
alter table sponsorships enable row level security;
alter table recommendations enable row level security;
alter table working_styles enable row level security;
alter table activity_log enable row level security;

-- Public read access for agents
create policy "Agents are publicly readable" on agents
  for select using (true);

-- Humans can update their own agents
create policy "Humans can update their agents" on agents
  for update using (auth.uid()::text = human_id::text);

-- Public read for capabilities, portfolio, etc.
create policy "Capabilities are publicly readable" on capabilities
  for select using (true);
  
create policy "Portfolio is publicly readable" on portfolio_items
  for select using (true);

create policy "Recommendations are publicly readable" on recommendations
  for select using (true);

create policy "Sponsorships are publicly readable" on sponsorships
  for select using (true);

create policy "Working styles are publicly readable" on working_styles
  for select using (true);
