import { formatTime, isWithinTwoHours } from '../data/mockData';
import './SlotTable.css';

const TYPE_LABELS = { regular: 'Regular', 'emergency-only': 'Emergency Only' };
const STATUS_DISPLAY = { available: 'Available', blocked: 'Blocked', locked: 'Locked' };

export default function SlotTable({ slots, selectedDate, doctorMap = {}, showDoctorColumn, onDelete, onUnblock, onEdit }) {
  const colCount = showDoctorColumn ? 6 : 5;
  return (
    <div className="table-wrap slot-table-wrap">
      <table className="appointment-table slot-table">
        <thead>
          <tr>
            <th>Start</th>
            <th>End</th>
            {showDoctorColumn && <th>Doctor</th>}
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slots.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="table-empty">No slots for this date. Add a slot or block time.</td>
            </tr>
          ) : (
            slots.map((slot) => {
              const locked = isWithinTwoHours(slot.start);
              const statusDisplay = locked ? 'Locked' : STATUS_DISPLAY[slot.status] || slot.status;
              const typeDisplay = TYPE_LABELS[slot.type] || slot.type;
              const isBlocked = slot.status === 'blocked';
              const isAvailable = slot.status === 'available' && !locked;

              return (
                <tr
                  key={slot.id}
                  className={`slot-row ${isBlocked ? 'row-blocked' : ''} ${slot.type === 'emergency-only' ? 'row-emergency-only' : ''} ${locked ? 'row-locked' : ''}`}
                >
                  <td>{formatTime(slot.start)}</td>
                  <td>{formatTime(slot.end)}</td>
                  {showDoctorColumn && <td>{slot.doctorId ? (doctorMap[slot.doctorId] ?? slot.doctorId) : '—'}</td>}
                  <td>{typeDisplay}</td>
                  <td>
                    <span className={`tag tag--${locked ? 'locked' : slot.status === 'blocked' ? 'blocked' : 'available'}`}>
                      {statusDisplay}
                    </span>
                    {slot.reason && isBlocked && <span className="slot-reason"> — {slot.reason}</span>}
                  </td>
                  <td className="slot-actions-cell">
                    {locked ? (
                      <span className="slot-no-action">—</span>
                    ) : isBlocked ? (
                      <button type="button" className="btn-sm btn-outline" onClick={() => onUnblock?.(slot.id)}>
                        Unblock
                      </button>
                    ) : (
                      <div className="actions-btns">
                        <button type="button" className="btn-sm btn-outline" onClick={() => onEdit?.(slot)}>
                          Edit
                        </button>
                        <button type="button" className="btn-sm btn-outline btn-danger" onClick={() => onDelete?.(slot.id)}>
                          Delete
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
