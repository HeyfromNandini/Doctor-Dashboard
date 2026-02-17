import { useState, useMemo } from 'react';
import { Plus, CalendarX } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import SlotTable from '../components/SlotTable';
import AddSlotModal from '../components/AddSlotModal';
import BlockTimeModal from '../components/BlockTimeModal';
import EditSlotModal from '../components/EditSlotModal';
import { useAuth, useCurrentSettings } from '../context/AuthContext';
import { MOCK_SLOTS, DEFAULT_SETTINGS } from '../data/mockData';
import './Schedule.css';

export default function Schedule() {
  const { user, accounts } = useAuth();
  const currentSettings = useCurrentSettings(DEFAULT_SETTINGS);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [slots, setSlots] = useState(MOCK_SLOTS);
  const [doctorFilter, setDoctorFilter] = useState('');
  const [addSlotOpen, setAddSlotOpen] = useState(false);
  const [blockTimeOpen, setBlockTimeOpen] = useState(false);
  const [editSlot, setEditSlot] = useState(null);

  const doctorMap = useMemo(() => Object.fromEntries(accounts.map((a) => [a.id, a.name])), [accounts]);
  const showDoctorColumn = accounts.length > 1;

  const filteredSlots = useMemo(() => {
    let list = slots.filter((s) => {
      const d = new Date(s.start);
      const sd = new Date(selectedDate);
      return d.getDate() === sd.getDate() && d.getMonth() === sd.getMonth() && d.getFullYear() === sd.getFullYear();
    });
    if (doctorFilter) list = list.filter((s) => s.doctorId === doctorFilter);
    return list;
  }, [slots, selectedDate, doctorFilter]);

  const addSlot = (start, end, type) => {
    setSlots((prev) => [...prev, { id: `s-${Date.now()}`, doctorId: user?.id ?? null, start, end, type: type || 'regular', status: 'available', reason: null }]);
  };

  const blockTime = (start, end, reason) => {
    setSlots((prev) => [...prev, { id: `s-${Date.now()}`, doctorId: user?.id ?? null, start, end, type: 'regular', status: 'blocked', reason: reason || null }]);
  };

  const deleteSlot = (id) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const unblockSlot = (id) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'available', reason: null } : s)));
  };

  const updateSlot = (id, start, end, type) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, start, end, type } : s)));
    setEditSlot(null);
  };

  return (
    <DashboardLayout
      clinicName={currentSettings.clinicName}
      pageTitle="Schedule"
      showDatePicker
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
    >
      <div className="schedule-page">
        <div className="schedule-toolbar">
          {accounts.length > 0 && (
            <label className="schedule-doctor-filter">
              <span className="filter-label">Doctor</span>
              <select value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)} className="filter-select" aria-label="Filter by doctor">
                <option value="">All doctors</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </label>
          )}
          <div className="toolbar-actions">
            <button type="button" className="btn-primary btn-icon" onClick={() => setAddSlotOpen(true)}>
              <Plus size={18} strokeWidth={2} aria-hidden />
              Add Slot
            </button>
            <button type="button" className="btn-outline btn-icon" onClick={() => setBlockTimeOpen(true)}>
              <CalendarX size={18} strokeWidth={2} aria-hidden />
              Block Time
            </button>
          </div>
        </div>
        <SlotTable
          slots={filteredSlots}
          selectedDate={selectedDate}
          doctorMap={doctorMap}
          showDoctorColumn={showDoctorColumn}
          onDelete={deleteSlot}
          onUnblock={unblockSlot}
          onEdit={setEditSlot}
        />
      </div>
      <AddSlotModal
        open={addSlotOpen}
        onClose={() => setAddSlotOpen(false)}
        onSave={addSlot}
        selectedDate={selectedDate}
      />
      <BlockTimeModal
        open={blockTimeOpen}
        onClose={() => setBlockTimeOpen(false)}
        onBlock={blockTime}
        selectedDate={selectedDate}
      />
      <EditSlotModal
        open={!!editSlot}
        slot={editSlot}
        onClose={() => setEditSlot(null)}
        onSave={updateSlot}
      />
    </DashboardLayout>
  );
}
