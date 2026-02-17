import { AlertCircle } from 'lucide-react';
import { formatTime, isWithinTwoHours } from '../data/mockData';
import './AppointmentTable.css';

const STATUS_LABELS = {
  confirmed: { label: 'Confirmed', className: 'tag--confirmed' },
  emergency: { label: 'Emergency', className: 'tag--emergency' },
  rescheduled: { label: 'Rescheduled', className: 'tag--rescheduled' },
  cancelled: { label: 'Cancelled', className: 'tag--cancelled' },
  completed: { label: 'Completed', className: 'tag--completed' },
  locked: { label: 'Locked', className: 'tag--locked' },
};

export default function AppointmentTable({ appointments, doctorMap = {}, showDoctorColumn, onSelect, onReschedule, onCancel }) {
  const colCount = showDoctorColumn ? 6 : 5;
  return (
    <div className="table-wrap">
      <table className="appointment-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Patient</th>
            {showDoctorColumn && <th>Doctor</th>}
            <th>Symptoms</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="table-empty">No appointments for this date.</td>
            </tr>
          ) : (
            appointments.map((apt) => {
              const locked = isWithinTwoHours(apt.time) && apt.status !== 'cancelled' && apt.status !== 'completed';
              const statusKey = locked ? 'locked' : apt.status;
              const statusInfo = STATUS_LABELS[statusKey] || STATUS_LABELS.confirmed;
              const isEmergency = apt.status === 'emergency';
              const isCompleted = apt.status === 'completed';
              const isCancelled = apt.status === 'cancelled';

              return (
                <tr
                  key={apt.id}
                  className={`table-row ${isEmergency ? 'row-emergency' : ''} ${isCancelled ? 'row-muted' : ''} ${locked ? 'row-locked' : ''}`}
                  onClick={() => onSelect(apt)}
                >
                  <td>{formatTime(apt.time)}</td>
                  <td>{apt.patientName}</td>
                  {showDoctorColumn && <td>{apt.doctorId ? (doctorMap[apt.doctorId] ?? apt.doctorId) : '—'}</td>}
                  <td>
                    <span className="symptoms-cell">
                      {Array.isArray(apt.symptoms) ? apt.symptoms.join(', ') : apt.symptoms}
                    </span>
                  </td>
                  <td>
                    {isEmergency && (
                      <span className="emergency-icon" title="Emergency" aria-hidden>
                        <AlertCircle size={16} strokeWidth={2} />
                      </span>
                    )}
                    <span className={`tag ${statusInfo.className}`}>{statusInfo.label}</span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {isCancelled ? (
                      '—'
                    ) : isCompleted ? (
                      <button
                        type="button"
                        className="btn-sm btn-outline"
                        onClick={() => onSelect(apt)}
                      >
                        View
                      </button>
                    ) : locked ? (
                      <button type="button" className="btn-sm btn-locked" disabled>
                        Locked
                      </button>
                    ) : (
                      <div className="actions-btns">
                        <button
                          type="button"
                          className="btn-sm btn-outline"
                          onClick={() => onReschedule?.(apt)}
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          className="btn-sm btn-outline btn-danger"
                          onClick={() => onCancel?.(apt)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
