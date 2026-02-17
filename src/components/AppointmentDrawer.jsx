import { X } from 'lucide-react';
import { formatTime, formatDate, isWithinTwoHours } from '../data/mockData';
import './AppointmentDrawer.css';

const STATUS_LABELS = {
  confirmed: 'Confirmed',
  emergency: 'Emergency',
  rescheduled: 'Rescheduled',
  cancelled: 'Cancelled',
  completed: 'Completed',
  locked: 'Locked',
};

export default function AppointmentDrawer({ appointment, onClose, onRequestReschedule, onRequestCancel }) {
  if (!appointment) return null;

  const locked = isWithinTwoHours(appointment.time) && appointment.status !== 'cancelled' && appointment.status !== 'completed';
  const isEmergency = appointment.status === 'emergency';
  const isDone = appointment.status === 'cancelled' || appointment.status === 'completed';
  const statusDisplay = locked ? 'Locked' : (STATUS_LABELS[appointment.status] || appointment.status);

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-label="Appointment details">
        <div className="drawer-header">
          <h2>Appointment Details</h2>
          <button type="button" className="drawer-close" onClick={onClose} aria-label="Close">
            <X size={20} strokeWidth={2} aria-hidden />
          </button>
        </div>
        <div className="drawer-body">
          <section className="drawer-section">
            <h3>Patient Info</h3>
            <p className="drawer-phone"><a href={`tel:${appointment.phone}`}>{appointment.phone}</a></p>
          </section>

          <section className="drawer-section">
            <h3>Symptoms</h3>
            <ul className="symptoms-list">
              {Array.isArray(appointment.symptoms)
                ? appointment.symptoms.map((s, i) => <li key={i}>{s}</li>)
                : <li>{appointment.symptoms}</li>}
            </ul>
            <p className="drawer-summary">{appointment.aiSummary}</p>
          </section>

          <section className="drawer-section">
            <h3>Appointment Info</h3>
            <dl className="drawer-dl">
              <dt>Time</dt>
              <dd>{formatTime(appointment.time)} · {formatDate(appointment.time)}</dd>
              <dt>Status</dt>
              <dd>{statusDisplay}</dd>
              {isEmergency && (
                <>
                  <dt>Emergency</dt>
                  <dd><span className="tag tag--emergency">Yes</span></dd>
                </>
              )}
            </dl>
          </section>

          <div className="drawer-actions">
            {isDone ? (
              <button type="button" className="btn-primary" onClick={onClose}>Close</button>
            ) : locked ? (
              <button type="button" className="btn-primary" onClick={onClose}>Close</button>
            ) : (
              <>
                <button type="button" className="btn-primary" onClick={() => onRequestReschedule?.(appointment)}>
                  Reschedule
                </button>
                <button type="button" className="btn-outline btn-danger" onClick={() => onRequestCancel?.(appointment)}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
