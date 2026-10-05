// frontend/src/components/shell/TopHeader.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Approved Figma top header, ported:
//   • breadcrumbs from the current path (react-router-dom v6 useLocation/Link)
//   • real user initials from useAuth() (no hardcoded "SA")
//   • live WebSocket connection status from the EXISTING WSContext
// ─────────────────────────────────────────────────────────────────────────────
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Sun, Moon, PanelLeftOpen, PanelLeftClose } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useWebSocket } from '../../contexts/WSContext'
import { useTheme } from '../../contexts/ThemeContext'
import { NotificationCenter } from './NotificationCenter'
import { IsolateLogo } from '../ui'

import { GlassSurface } from '../ui'

const routeLabels = {
  dashboard:           'Dashboard',
  copilot:             'AI Assistant',
  escalations:         'Action Center',
  workflows:           'Workflows',
  'workflow-library':  'Workflow Library',
  builder:             'Workflow Builder',
  evidence:            'Evidence',
  'ai-engine':         'AI Services',
  integrations:        'Integrations',
  settings:            'Settings',
  general:             'Profile',
  config:              'Profile',
  models:              'Model Catalog',
  budget:              'Budget & Billing',
  tools:               'Integrations',
  prompts:             'Prompts',
  'email-queue':       'Email Queue',
  patterns:            'Patterns',
  admin:               'Platform Overview',
  users:               'Users',
  fleet:               'Fleet Cost',
  health:              'System Health',
  organizations:       'Organizations',
  runs:                'Workflow Runs',
  reviews:             'Review Queue',
  'ai-services':       'AI Services',
  providers:           'Provider Connections',
  routing:             'Routing & Assignments',
  usage:               'Usage & Cost',
  audit:               'Audit Log',
}

function WSDot({ status }) {
  const color =
    status === 'connected' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-slate-300'
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
      <span className={`w-1.5 h-1.5 rounded-full ${color} ${status === 'connected' ? 'animate-pulse' : ''}`} />
      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 capitalize hidden sm:inline">{status}</span>
    </div>
  )
}

export function TopHeader({ sidebarCollapsed = false, onToggleSidebar }) {
  const location = useLocation()
  const { user, isAdmin } = useAuth()
  const { status } = useWebSocket()
  const { theme, toggle, isDark } = useTheme()

  const parts = location.pathname.split('/').filter(Boolean)
  const crumbs = parts.map((part, i) => ({
    label: routeLabels[part] ?? part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
    to: '/' + parts.slice(0, i + 1).join('/'),
    isLast: i === parts.length - 1,
  }))

  const home = isAdmin ? '/admin' : '/dashboard'
  const displayName = (user?.full_name || user?.email || 'U').replace(/SMBFlow/gi, 'Isolate')
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const avatarUrl = user?.avatar_url || localStorage.getItem(`avatar_${user?.id}`) || localStorage.getItem('smbflow_avatar')

  return (
    <header className="h-14 shrink-0 bg-transparent border-b border-slate-200/50 dark:border-[#233048]/50 z-10 sticky top-0">
      <GlassSurface width="100%" height="100%" backgroundOpacity={0.05} borderRadius={0}>
        <div className="w-full h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-2 min-w-0">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#182234] transition-colors flex items-center justify-center cursor-pointer shrink-0 mr-1 group"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                ) : (
                  <PanelLeftClose className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                )}
              </button>
            )}

            {sidebarCollapsed && (
              <Link
                to={isAdmin ? '/admin/copilot' : '/copilot'}
                className="flex items-center gap-1.5 mr-2 shrink-0 group hover:opacity-80 transition-opacity"
                title="Isolate"
              >
                <IsolateLogo size="sm" isDark={isDark} />
                {isAdmin && (
                  <span className="text-[9px] font-bold uppercase bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-800">
                    Admin
                  </span>
                )}
              </Link>
            )}

            <nav className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              {crumbs.length === 0 ? (
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{isAdmin ? 'Platform Overview' : 'Dashboard'}</span>
              ) : (
                crumbs.map((crumb, idx) => (
                  <span key={crumb.to} className="flex items-center gap-1.5">
                    {idx > 0 && <ChevronRight size={13} className="text-slate-300 dark:text-slate-600" />}
                    {crumb.isLast ? (
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{crumb.label}</span>
                    ) : (
                      <Link to={crumb.to} className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors truncate">
                        {crumb.label}
                      </Link>
                    )}
                  </span>
                ))
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Global + Personal Notification Center */}
            <NotificationCenter />

            {/* Global Persistent Theme Toggle */}
            <button
              type="button"
              onClick={toggle}
              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <WSDot status={status} />

            {/* Clickable Profile Avatar */}
            <Link
              to="/settings/general"
              className="w-8 h-8 rounded-full bg-blue-600 hover:ring-2 hover:ring-blue-400 overflow-hidden flex items-center justify-center shadow-xs transition-all cursor-pointer"
              title={`View Profile (${user?.full_name || user?.email || 'User'})`}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-white">{initials}</span>
              )}
            </Link>
          </div>
        </div>
      </GlassSurface>
    </header>
  )
}

