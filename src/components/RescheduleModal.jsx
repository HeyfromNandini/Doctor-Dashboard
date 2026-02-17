import { useState } from 'react';
import { X } from 'lucide-react';
import { formatTime } from '../data/mockData';
import './Modal.css';

// Mock available slots for reschedule
const MOCK_AVAILABLE_SLOTS = [
  { start: new Date(), id: 'rs1' },
  { start: new Date(Date.now() + 86400000), id: 'rs2' },
  { start: new Date(Date.now() + 86400000 * 2), id: 'rs3' },
].map((s, i) => ({
  ...s,
  start: new Date(s.start.getFullYear(), s.start.getMonth(), s.start.getDate(), 10 + i, 0, 0),
}));

export default function RescheduleModal({ appointment, onClose, onConfirm }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSlot) return;
    onConfirm(appointment.id, selectedSlot);
    onClose();
  };

  if (!appointment) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Reschedule Appointment</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close"><X size={20} strokeWidth={2} aria-hidden /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p className="modal-hint">Select a new time. Patient will be notified.</p>
            <div className="slot-list">
              {MOCK_AVAILABLE_SLOTS.map((slot) => (
                <label key={slot.id} className="slot-option">
                  <input
                    type="radio"
                    name="slot"
                    checked={selectedSlot?.id === slot.id}
                    onChange={() => setSelectedSlot(slot)}
                  />
                  <span>{formatTime(slot.start)}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={!selectedSlot}>
              Confirm Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
