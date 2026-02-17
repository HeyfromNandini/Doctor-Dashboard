import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, Clock, DollarSign, Building2, Phone, MessageCircle, Pencil, UserPlus, LogIn, Trash2 } from 'lucide-react';
import { useAuth, getSettingsKey } from '../context/AuthContext';
import { DEFAULT_SETTINGS } from '../data/mockData';
import './DoctorDetailsPanel.css';

export default function DoctorDetailsPanel({ open, onClose, anchorRef }) {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const { user, accounts, switchAccount, addAccount, removeAccount } = useAuth();
  const [addDoctorOpen, setAddDoctorOpen] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addPassword, setAddPassword] = useState('');

  const storageKey = getSettingsKey(user?.id);
  const settings = (() => {
    try {
      const s = localStorage.getItem(storageKey);
      return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  })();

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && anchorRef?.current && !anchorRef.current.contains(e.target) && !e.target.closest('.add-doctor-modal')) {
        onClose();
      }
    };
    const handleEscape = (e) => { if (e.key === 'Escape') { setAddDoctorOpen(false); onClose(); } };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose, anchorRef]);

  const handleEditSettings = () => {
    onClose();
    navigate('/settings');
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!addEmail.trim() || !addPassword) return;
    addAccount(addEmail.trim(), addPassword);
    setAddEmail('');
    setAddPassword('');
    setAddDoctorOpen(false);
  };

  const handleRemoveAccount = (id, e) => {
    e?.stopPropagation();
    if (accounts.length <= 1) return;
    if (window.confirm('Remove this doctor from the dashboard?')) removeAccount(id);
    if (id === user?.id) onClose();
  };

  if (!open) return null;

  const row = (Icon, label, value) => {
    if (value == null || value === '') return null;
    return (
      <div className="doctor-panel-row">
        <Icon size={18} className="doctor-panel-icon" aria-hidden />
        <div className="doctor-panel-meta">
          <span className="doctor-panel-label">{label}</span>
          <span className="doctor-panel-value">{value}</span>
        </div>
      </div>
    );
  };

  const otherAccounts = accounts.filter((a) => a.id !== user?.id);

  return (
    <>
      <div ref={panelRef} className="doctor-panel" role="dialog" aria-label="Doctor profile">
        <div className="doctor-panel-header">
          <div className="doctor-panel-avatar">
            <User size={28} strokeWidth={1.5} aria-hidden />
          </div>
          <h3 className="doctor-panel-name">{settings.fullName || user?.name || 'Doctor'}</h3>
          {settings.specialization && (
            <p className="doctor-panel-spec">{settings.specialization}</p>
          )}
        </div>
        <div className="doctor-panel-body">
          {row(GraduationCap, 'Qualification', settings.qualification)}
          {row(Clock, 'Experience', settings.experienceYears != null ? `${settings.experienceYears} years` : null)}
          {row(DollarSign, 'Consultation Fee', settings.consultationFee != null ? String(settings.consultationFee) : null)}
          {row(Building2, 'Clinic', settings.clinicName)}
          {row(Phone, 'Phone', settings.registeredPhone)}
          {row(MessageCircle, 'WhatsApp', settings.whatsapp)}
        </div>

        {accounts.length > 1 && (
          <div className="doctor-panel-accounts">
            <span className="doctor-panel-label">Accounts</span>
            {otherAccounts.map((acc) => (
              <div key={acc.id} className="doctor-panel-account-row">
                <span className="doctor-panel-account-name">{acc.name}</span>
                <span className="doctor-panel-account-email">{acc.email}</span>
                <div className="doctor-panel-account-actions">
                  <button type="button" className="btn-sm btn-outline" onClick={() => { switchAccount(acc.id); onClose(); }}>
                    <LogIn size={14} aria-hidden />
                    Switch
                  </button>
                  <button type="button" className="btn-sm btn-outline btn-danger" onClick={(e) => handleRemoveAccount(acc.id, e)} title="Remove account">
                    <Trash2 size={14} aria-hidden />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="doctor-panel-footer">
          <button type="button" className="doctor-panel-edit btn-outline btn-icon" onClick={handleEditSettings}>
            <Pencil size={16} aria-hidden />
            Edit in Settings
          </button>
          <button type="button" className="doctor-panel-add btn-outline btn-icon" onClick={() => setAddDoctorOpen(true)}>
            <UserPlus size={16} aria-hidden />
            Add another doctor
          </button>
        </div>
      </div>

      {addDoctorOpen && (
        <div className="add-doctor-backdrop" onClick={() => setAddDoctorOpen(false)}>
          <div className="add-doctor-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add another doctor</h3>
            <form onSubmit={handleAddDoctor}>
              <label>
                <span className="label-text">Email</span>
                <input type="email" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} placeholder="doctor@clinic.com" required className="settings-input" />
              </label>
              <label>
                <span className="label-text">Password</span>
                <input type="password" value={addPassword} onChange={(e) => setAddPassword(e.target.value)} placeholder="••••••••" required className="settings-input" />
              </label>
              <div className="add-doctor-modal-actions">
                <button type="button" className="btn-outline" onClick={() => setAddDoctorOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
