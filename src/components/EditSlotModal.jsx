import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

function toTimeStr(d) {
  const date = new Date(d);
  const h = date.getHours();
  const m = date.getMinutes();
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function EditSlotModal({ open, slot, onClose, onSave }) {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('09:30');
  const [type, setType] = useState('regular');

  useEffect(() => {
    if (slot) {
      setStartTime(toTimeStr(slot.start));
      setEndTime(toTimeStr(slot.end));
      setType(slot.type || 'regular');
    }
  }, [slot]);

  if (!open || !slot) return null;

  const baseDate = new Date(slot.start);
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), startHour, startMin, 0);
  const end = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), endHour, endMin, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (end <= start) return;
    onSave(slot.id, start, end, type);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Slot</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close"><X size={20} strokeWidth={2} aria-hidden /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label>
              <span className="label-text">Start Time</span>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="modal-input" required />
            </label>
            <label>
              <span className="label-text">End Time</span>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="modal-input" required />
            </label>
            <label>
              <span className="label-text">Slot Type</span>
              <select value={type} onChange={(e) => setType(e.target.value)} className="modal-input">
                <option value="regular">Regular</option>
                <option value="emergency-only">Emergency Only</option>
              </select>
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
