import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame, STEPS } from '../../context/GameContext.jsx';

const STEP_META = [
  { key: 'wonder',   label: 'Wonder',   icon: '🔮', path: '/wonder'   },
  { key: 'story',    label: 'Story',    icon: '📖', path: '/story'    },
  { key: 'simulate', label: 'Simulate', icon: '✏️', path: '/simulate' },
  { key: 'play',     label: 'Play',     icon: '🎮', path: '/play'     },
  { key: 'reflect',  label: 'Reflect',  icon: '📝', path: '/reflect'  },
];

export default function TopNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { completed } = useGame();

  return (
    <nav className="topnav">
      {/* Home button */}
      <button className="home-btn" onClick={() => navigate('/')}>🏠 Home</button>

      {/* Step tabs */}
      <div className="step-tabs">
        {STEP_META.map((step, i) => {
          const isActive = pathname === step.path || pathname.startsWith(step.path + '/');
          const isDone   = completed.has(step.key) && !isActive;
          return (
            <React.Fragment key={step.key}>
              {i > 0 && <span className="step-separator">→</span>}
              <div
                className={`step-tab ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                onClick={() => (isDone || isActive) && navigate(step.path)}
                style={{ cursor: isDone ? 'pointer' : isActive ? 'default' : 'default' }}
              >
                <span>{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                <span>{step.icon}</span>
                <span>{step.label}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Spacer to balance layout */}
      <div style={{ width: '72px' }} />
    </nav>
  );
}
