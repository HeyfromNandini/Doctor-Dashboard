import { useState } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export default function BlockTimeModal({ open, onClose, onBlock, selectedDate }) {
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('13:00');
  const [reason, setReason] = useState('');

  if (!open) return null;

  const baseDate = selectedDate ? new Date(selectedDate) : new Date();
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), startHour, startMin, 0);
  const end = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), endHour, endMin, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (end <= start) return;
    onBlock(start, end, reason.trim() || null);
    onClose();
    setStartTime('12:00');
    setEndTime('13:00');
    setReason('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Block Time</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close"><X size={20} strokeWidth={2} aria-hidden /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <label>
              <span className="label-text">Start Time</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="modal-input"
                required
              />
            </label>
            <label>
              <span className="label-text">End Time</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="modal-input"
                required
              />
            </label>
            <label>
              <span className="label-text">Reason (optional)</span>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="modal-input"
                placeholder="e.g. Lunch break"
              />
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Block</button>
          </div>
        </form>
      </div>
    </div>
  );
}
