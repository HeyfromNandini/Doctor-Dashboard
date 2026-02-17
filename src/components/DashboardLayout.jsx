import { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDayOfWeek } from '../data/mockData';
import DoctorDetailsPanel from './DoctorDetailsPanel';
import './DashboardLayout.css';

const navIconSize = 20;

export default function DashboardLayout({ children, clinicName, pageTitle, showDatePicker, selectedDate, onDateChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctorPanelOpen, setDoctorPanelOpen] = useState(false);
  const doctorTriggerRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">{clinicName || 'Clinic'}</div>
        <nav className="sidebar-nav">
          <NavLink to="/today" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <CalendarDays size={navIconSize} className="nav-icon" aria-hidden />
            <span>Today</span>
          </NavLink>
          <NavLink to="/schedule" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Clock size={navIconSize} className="nav-icon" aria-hidden />
            <span>Schedule</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Settings size={navIconSize} className="nav-icon" aria-hidden />
            <span>Settings</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button type="button" className="nav-item nav-logout" onClick={handleLogout}>
            <LogOut size={navIconSize} className="nav-icon" aria-hidden />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-left top-bar-doctor-wrap">
            <button
              ref={doctorTriggerRef}
              type="button"
              className="doctor-trigger"
              onClick={() => setDoctorPanelOpen((o) => !o)}
              aria-expanded={doctorPanelOpen}
              aria-haspopup="dialog"
            >
              <div className="top-bar-doctor">
                <span className="doctor-name">{user?.name || 'Doctor'}</span>
                {user?.email && <span className="doctor-email">{user.email}</span>}
              </div>
              <ChevronDown size={16} className={`doctor-chevron ${doctorPanelOpen ? 'open' : ''}`} aria-hidden />
            </button>
            <DoctorDetailsPanel
              open={doctorPanelOpen}
              onClose={() => setDoctorPanelOpen(false)}
              anchorRef={doctorTriggerRef}
            />
          </div>
          <div className="top-bar-center">{pageTitle}</div>
          <div className="top-bar-right">
            {showDatePicker && selectedDate != null && onDateChange && (
              <div className="date-selector">
                <input
                  type="date"
                  value={selectedDate.toISOString().slice(0, 10)}
                  onChange={(e) => onDateChange(new Date(e.target.value))}
                  className="date-input"
                  aria-label="Date"
                />
                <span className="date-day">{formatDayOfWeek(selectedDate)}</span>
              </div>
            )}
          </div>
        </header>
        <div className="page-body">{children}</div>
      </main>
    </div>
  );
}
