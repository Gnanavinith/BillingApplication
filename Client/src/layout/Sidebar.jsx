import React, { useState } from 'react';

const Icon = ({ path, className }) => (
  <svg className={className || 'sb-icon'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const items = [
  { key: 'home', label: 'Home', icon: 'M3 12l9-9 9 9M9 21V9h6v12' },
  { key: 'dashboard', label: 'Dashboard', icon: 'M3 3h7v7H3zM14 3h7v4h-7zM14 9h7v12h-7zM3 12h7v9H3z' },
  { key: 'billing', label: 'Billing', icon: 'M3 6h18M3 12h18M3 18h18' },
  { key: 'dealers', label: 'Dealers', icon: 'M20 21v-2a4 4 0 00-4-4h-8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z' },
  { key: 'inventory', label: 'Inventory', icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4a2 2 0 001-1.73z' },
  { key: 'settings', label: 'Settings', icon: 'M12 1v3M12 20v3M4.22 4.22l2.12 2.12M15.66 15.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M15.66 8.34l2.12-2.12' },
];

export default function Sidebar({ activeKey = 'dashboard', onNavigate = () => {} }) {
  const [reportsOpen, setReportsOpen] = useState(activeKey === 'reports');
  return (
    <aside className="sb-sidebar">
      <div className="sb-logo" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="sb-row" style={{ gap: 10 }}>
          <div className="sb-logo-badge">SB</div>
          <div>
            <div style={{ fontWeight: 700 }}>SmartBilling</div>
            <div style={{ fontSize: 12, color: 'var(--sb-text-muted)' }}>Admin Panel</div>
          </div>
        </div>
        <button className="sb-icon-button" aria-label="Hide sidebar" onClick={() => onNavigate('__hide_sidebar__')}>
          <Icon className="sb-icon" path="M18 6L6 18M6 6l12 12" />
        </button>
      </div>

      <nav className="sb-nav">
        {items.map(item => (
          <button
            key={item.key}
            className={`sb-nav-item ${activeKey === item.key ? 'is-active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            <Icon path={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}

        {/* Reports dropdown */}
        <div>
          <button
            className={`sb-nav-item ${activeKey === 'reports' ? 'is-active' : ''}`}
            onClick={() => setReportsOpen(v => !v)}
            aria-expanded={reportsOpen}
            aria-controls="sb-subnav-reports"
          >
            <Icon path="M3 12l2-2 4 4 8-8 4 4" />
            <span>Reports</span>
            <span style={{ marginLeft: 'auto' }}>
              <Icon className="sb-icon" path={reportsOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
            </span>
          </button>
          {reportsOpen && (
            <div id="sb-subnav-reports" className="sb-subnav">
              <button className="sb-nav-item" onClick={() => onNavigate('reports')}>
                <span>Sales Report</span>
              </button>
              <button className="sb-nav-item" onClick={() => onNavigate('reports-stock')}>
                <span>Stock Report</span>
              </button>
              <button className="sb-nav-item" onClick={() => onNavigate('reports-pl')}>
                <span>Profit & Loss</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="sb-spacer" />

      <div className="sb-logout">
        <button className="sb-nav-item" onClick={() => onNavigate('logout')}>
          <Icon path="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

