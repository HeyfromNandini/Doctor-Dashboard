import { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AppointmentTable from '../components/AppointmentTable';
import AppointmentDrawer from '../components/AppointmentDrawer';
import CancelAppointmentModal from '../components/CancelAppointmentModal';
import RescheduleModal from '../components/RescheduleModal';
import { useAuth, useCurrentSettings } from '../context/AuthContext';
import { MOCK_APPOINTMENTS, DEFAULT_SETTINGS } from '../data/mockData';
import './Today.css';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'rescheduled', label: 'Rescheduled' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

export default function Today() {
  const { accounts } = useAuth();
  const currentSettings = useCurrentSettings(DEFAULT_SETTINGS);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);

  const doctorMap = useMemo(() => Object.fromEntries(accounts.map((a) => [a.id, a.name])), [accounts]);
  const showDoctorColumn = accounts.length > 1;

  const filteredAppointments = useMemo(() => {
    let list = [...appointments].filter((a) => {
      const d = new Date(a.time);
      const sd = new Date(selectedDate);
      return d.getDate() === sd.getDate() && d.getMonth() === sd.getMonth() && d.getFullYear() === sd.getFullYear();
    });
    if (doctorFilter) list = list.filter((a) => a.doctorId === doctorFilter);
    if (statusFilter) list = list.filter((a) => a.status === statusFilter);
    list.sort((a, b) => new Date(a.time) - new Date(b.time));
    const emergency = list.filter((a) => a.status === 'emergency');
    const rest = list.filter((a) => a.status !== 'emergency');
    return [...emergency, ...rest];
  }, [appointments, selectedDate, statusFilter, doctorFilter]);

  const updateAppointment = (id, updates) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    if (selectedAppointment?.id === id) setSelectedAppointment((a) => (a ? { ...a, ...updates } : null));
  };

  const handleCancelConfirm = (id) => {
    updateAppointment(id, { status: 'cancelled' });
    setCancelTarget(null);
    setSelectedAppointment(null);
  };

  const handleRescheduleConfirm = (id, newSlot) => {
    updateAppointment(id, { time: newSlot.start, status: 'rescheduled' });
    setRescheduleTarget(null);
    setSelectedAppointment(null);
  };

  return (
    <DashboardLayout
      clinicName={currentSettings.clinicName}
      pageTitle="Today"
      showDatePicker
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
    >
      <div className="today-page">
        <div className="today-filters">
          {accounts.length > 0 && (
            <label>
              <span className="filter-label">Doctor</span>
              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="filter-select"
                aria-label="Filter by doctor"
              >
                <option value="">All doctors</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </label>
          )}
          <label>
            <span className="filter-label">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
              aria-label="Filter by status"
            >
              {STATUS_FILTER_OPTIONS.map((o) => (
                <option key={o.value || 'all'} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>
        <AppointmentTable
          appointments={filteredAppointments}
          doctorMap={doctorMap}
          showDoctorColumn={showDoctorColumn}
          onSelect={setSelectedAppointment}
          onReschedule={(apt) => { setSelectedAppointment(apt); setRescheduleTarget(apt); }}
          onCancel={(apt) => { setSelectedAppointment(apt); setCancelTarget(apt); }}
        />
      </div>
      <AppointmentDrawer
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onRequestReschedule={(apt) => setRescheduleTarget(apt)}
        onRequestCancel={(apt) => setCancelTarget(apt)}
      />
      <CancelAppointmentModal
        appointment={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
      />
      <RescheduleModal
        appointment={rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        onConfirm={handleRescheduleConfirm}
      />
    </DashboardLayout>
  );
}
