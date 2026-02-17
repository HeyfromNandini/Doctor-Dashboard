import { useState } from 'react';
import { X } from 'lucide-react';
import { isWithinTwoHours } from '../data/mockData';
import './Modal.css';

export default function CancelAppointmentModal({ appointment, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const withinTwo = appointment ? isWithinTwoHours(appointment.time) : false;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (withinTwo) {
      setError('Cannot cancel within 2 hours.');
      return;
    }
    if (!reason.trim()) {
      setError('Reason is required.');
      return;
    }
    onConfirm(appointment.id, reason.trim());
    onClose();
  };

  if (!appointment) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Cancel Appointment</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close"><X size={20} strokeWidth={2} aria-hidden /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {withinTwo && (
              <p className="modal-error">Cannot cancel within 2 hours of the appointment.</p>
            )}
            <label>
              <span className="label-text">Reason (Required)</span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Patient requested cancellation"
                rows={3}
                className="modal-input"
                disabled={withinTwo}
              />
            </label>
            {error && <p className="modal-error">{error}</p>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose}>Back</button>
            <button type="submit" className="btn-danger-solid" disabled={withinTwo}>
              Confirm Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
