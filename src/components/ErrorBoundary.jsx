import { Component } from 'react';

/**
 * Without this, any render error leaves a blank white page with no clue why.
 * Shows the error and a one-click "reset saved data" (clears this app's localStorage and reloads).
 */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[FutureMinds] render crash:', error, info?.componentStack);
  }

  resetAndReload = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('futureminds_'))
        .forEach((k) => localStorage.removeItem(k));
    } catch { /* storage unavailable */ }
    window.location.href = '/app.html?view=role-select';
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f8fafc', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: 560, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,.06)' }}>
          <h1 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>Something went wrong</h1>
          <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.5 }}>
            The page hit an error while loading. Resetting your saved app data usually fixes it. If it keeps happening,
            send the message below to the developer.
          </p>
          <pre style={{ background: '#f1f5f9', borderRadius: 10, padding: 12, fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#b91c1c' }}>
            {String(this.state.error?.stack || this.state.error?.message || this.state.error).slice(0, 700)}
          </pre>
          <button type="button" onClick={this.resetAndReload}
            style={{ background: '#7c3aed', color: '#fff', border: 0, borderRadius: 12, padding: '10px 18px', fontWeight: 700, cursor: 'pointer' }}>
            Reset saved data and reload
          </button>
        </div>
      </div>
    );
  }
}

