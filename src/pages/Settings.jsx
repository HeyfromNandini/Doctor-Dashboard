import { useState, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth, getSettingsKey } from '../context/AuthContext';
import {
  DEFAULT_SETTINGS,
  SLOT_DURATION_OPTIONS,
  WORKING_DAY_KEYS,
  WORKING_DAY_LABELS,
  CONSULTATION_TYPE_OPTIONS,
} from '../data/mockData';
import './Settings.css';

export default function Settings() {
  const { user } = useAuth();
  const storageKey = getSettingsKey(user?.id);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [backup, setBackup] = useState(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem(storageKey);
      if (s) {
        const loaded = { ...DEFAULT_SETTINGS, ...JSON.parse(s) };
        if (loaded.phone != null && loaded.registeredPhone == null) loaded.registeredPhone = loaded.phone;
        setSettings(loaded);
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (_) {}
  }, [storageKey]);

  const update = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const updateWorkingDay = (day, checked) => {
    setSettings((prev) => ({
      ...prev,
      workingDays: { ...prev.workingDays, [day]: checked },
    }));
  };

  const handleEdit = () => {
    setBackup(JSON.parse(JSON.stringify(settings)));
    setEditing(true);
  };

  const handleCancel = () => {
    if (backup) setSettings(backup);
    setBackup(null);
    setEditing(false);
  };

  const handleSave = (e) => {
    e?.preventDefault();
    localStorage.setItem(storageKey, JSON.stringify(settings));
    setBackup(null);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeactivateAI = () => {
    if (window.confirm('Deactivate AI Agent? You can reactivate it later from settings.')) {
      // Placeholder for API / state
    }
  };

  const input = (key, type = 'text', opts = {}) => (
    <input
      type={type}
      value={settings[key] ?? ''}
      onChange={(e) => update(key, type === 'number' ? Number(e.target.value) || 0 : e.target.value)}
      className="settings-input"
      readOnly={!editing}
      disabled={!editing}
      {...opts}
    />
  );

  return (
    <DashboardLayout
      clinicName={settings.clinicName}
      pageTitle="Settings"
      showDatePicker={false}
    >
      <div className="settings-page">
        <header className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <div className="settings-actions-top">
            {!editing ? (
              <>
                <button type="button" className="btn-outline btn-icon" onClick={handleEdit}>
                  <Pencil size={16} aria-hidden />
                  Edit
                </button>
                {saved && <span className="settings-saved">Saved.</span>}
              </>
            ) : (
              <>
                <button type="button" className="btn-primary btn-icon" onClick={handleSave}>
                  <Check size={16} aria-hidden />
                  Save Changes
                </button>
                <button type="button" className="btn-outline btn-icon" onClick={handleCancel}>
                  <X size={16} aria-hidden />
                  Cancel
                </button>
              </>
            )}
          </div>
        </header>

        <form onSubmit={handleSave} className="settings-form">
          {/* Section 1: Basic Information */}
          <section className="settings-section">
            <h2>Basic Information</h2>
            <label>
              <span className="label-text">Full Name</span>
              {input('fullName')}
            </label>
            <label>
              <span className="label-text">Specialization</span>
              {input('specialization')}
            </label>
            <label>
              <span className="label-text">Qualification</span>
              {input('qualification')}
            </label>
            <label>
              <span className="label-text">Experience (Years)</span>
              {input('experienceYears', 'number', { min: 0, max: 50 })}
            </label>
            <label>
              <span className="label-text">Consultation Fee</span>
              {input('consultationFee', 'number', { min: 0 })}
            </label>
            <label>
              <span className="label-text">Clinic Name</span>
              {input('clinicName')}
            </label>
          </section>

          {/* Section 2: Contact Information */}
          <section className="settings-section">
            <h2>Contact Information</h2>
            <label>
              <span className="label-text">Registered Phone</span>
              <input
                type="tel"
                value={settings.registeredPhone ?? ''}
                readOnly
                className="settings-input settings-input-readonly"
                aria-readonly="true"
              />
            </label>
            <label>
              <span className="label-text">WhatsApp Number</span>
              {input('whatsapp', 'tel')}
            </label>
            <label>
              <span className="label-text">Clinic Address</span>
              {input('clinicAddress')}
            </label>
            <label>
              <span className="label-text">Time Zone</span>
              {input('timeZone')}
            </label>
          </section>

          {/* Section 3: Working Preferences */}
          <section className="settings-section">
            <h2>Working Preferences</h2>
            <div className="field-group">
              <span className="label-text">Working Days</span>
              <div className="working-days-grid">
                {WORKING_DAY_KEYS.map((day) => (
                  <label key={day} className="working-day-chip">
                    <input
                      type="checkbox"
                      checked={settings.workingDays?.[day] ?? false}
                      onChange={(e) => updateWorkingDay(day, e.target.checked)}
                      disabled={!editing}
                    />
                    <span>{WORKING_DAY_LABELS[day]}</span>
                  </label>
                ))}
              </div>
            </div>
            <label>
              <span className="label-text">Slot Duration</span>
              <select
                value={settings.slotDuration ?? 30}
                onChange={(e) => update('slotDuration', Number(e.target.value))}
                className="settings-input"
                disabled={!editing}
              >
                {SLOT_DURATION_OPTIONS.map((m) => (
                  <option key={m} value={m}>{m} min</option>
                ))}
              </select>
            </label>
            <div className="time-range-row">
              <label>
                <span className="label-text">Morning Time Range</span>
                <div className="time-range-inputs">
                  {input('morningStart', 'time')}
                  <span className="time-range-sep">to</span>
                  {input('morningEnd', 'time')}
                </div>
              </label>
            </div>
            <div className="time-range-row">
              <label>
                <span className="label-text">Evening Time Range</span>
                <div className="time-range-inputs">
                  {input('eveningStart', 'time')}
                  <span className="time-range-sep">to</span>
                  {input('eveningEnd', 'time')}
                </div>
              </label>
            </div>
          </section>

          {/* Section 4: Emergency Settings */}
          <section className="settings-section">
            <h2>Emergency Settings</h2>
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={settings.allowEmergencyOverride ?? true}
                onChange={(e) => update('allowEmergencyOverride', e.target.checked)}
                disabled={!editing}
              />
              <span>Allow Emergency Override</span>
            </label>
            <label>
              <span className="label-text">Max Emergency Per Day</span>
              {input('maxEmergencyPerDay', 'number', { min: 1, max: 20 })}
            </label>
            <label>
              <span className="label-text">Emergency Slot Buffer (minutes)</span>
              {input('emergencySlotBufferMinutes', 'number', { min: 0, max: 60 })}
            </label>
          </section>

          {/* Section 5: AI Settings */}
          <section className="settings-section">
            <h2>AI Settings</h2>
            <label>
              <span className="label-text">Supported Languages</span>
              {input('supportedLanguages', 'text', { placeholder: 'e.g. English, Spanish' })}
            </label>
            <label>
              <span className="label-text">Consultation Type</span>
              <select
                value={settings.consultationType ?? 'both'}
                onChange={(e) => update('consultationType', e.target.value)}
                className="settings-input"
                disabled={!editing}
              >
                {CONSULTATION_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="label-text">Online Meeting Link (if applicable)</span>
              {input('onlineMeetingLink', 'url', { placeholder: 'https://...' })}
            </label>
          </section>

          <div className="settings-footer">
            <button
              type="button"
              className="btn-outline btn-danger"
              onClick={handleDeactivateAI}
            >
              Deactivate AI Agent
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
