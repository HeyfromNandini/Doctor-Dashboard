// Mock data for MVP – replace with API later
// Appointment status enum: confirmed | emergency | rescheduled | cancelled | completed (locked is computed ≤2h)
// Slot type enum: regular | emergency-only. Slot status: available | blocked (locked is computed ≤2h)

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

function addHours(d, h) {
  const r = new Date(d);
  r.setHours(r.getHours() + h);
  return r;
}

export const MOCK_APPOINTMENTS = [
  {
    id: '1',
    doctorId: null,
    time: addHours(today, 9),
    patientName: 'John Doe',
    phone: '+1 555-0101',
    symptoms: ['Fever', 'Cough', 'Fatigue'],
    duration: 30,
    status: 'emergency',
    bookingTime: addHours(today, -24),
    aiSummary: 'Patient reported high fever (101.5°F) and persistent cough for 3 days. No recent travel. Recommended urgent evaluation.',
    verified: false,
  },
  {
    id: '2',
    doctorId: null,
    time: addHours(today, 10),
    patientName: 'Jane Smith',
    phone: '+1 555-0102',
    symptoms: ['Routine checkup', 'Blood pressure'],
    duration: 20,
    status: 'confirmed',
    bookingTime: addHours(today, -48),
    aiSummary: 'Annual checkup. BP monitoring requested.',
    verified: null,
  },
  {
    id: '3',
    doctorId: null,
    time: addHours(today, 11),
    patientName: 'Bob Wilson',
    phone: '+1 555-0103',
    symptoms: ['Back pain', 'Limited mobility'],
    duration: 25,
    status: 'rescheduled',
    bookingTime: addHours(today, -72),
    aiSummary: 'Lower back pain, rescheduled from yesterday.',
    verified: null,
  },
  {
    id: '4',
    doctorId: null,
    time: addHours(today, 8),
    patientName: 'Emma Done',
    phone: '+1 555-0106',
    symptoms: ['Follow-up'],
    duration: 15,
    status: 'completed',
    bookingTime: addHours(today, -72),
    aiSummary: 'Follow-up visit completed.',
    verified: null,
  },
  {
    id: '5',
    doctorId: null,
    time: addHours(today, 14),
    patientName: 'Alice Brown',
    phone: '+1 555-0104',
    symptoms: ['Skin rash', 'Itching'],
    duration: 15,
    status: 'confirmed',
    bookingTime: addHours(today, -12),
    aiSummary: 'Rash on arms, started 2 days ago.',
    verified: null,
  },
  {
    id: '6',
    doctorId: null,
    time: addHours(today, 15),
    patientName: 'Charlie Lee',
    phone: '+1 555-0105',
    symptoms: ['Cancelled by patient'],
    duration: 0,
    status: 'cancelled',
    bookingTime: addHours(today, -96),
    aiSummary: 'Patient requested cancellation.',
    verified: null,
  },
];

export const MOCK_SLOTS = [
  { id: 's1', doctorId: null, start: addHours(today, 9), end: addHours(today, 9.5), type: 'regular', status: 'available' },
  { id: 's2', doctorId: null, start: addHours(today, 9.5), end: addHours(today, 10), type: 'regular', status: 'available' },
  { id: 's3', doctorId: null, start: addHours(today, 10), end: addHours(today, 10.5), type: 'regular', status: 'available' },
  { id: 's4', doctorId: null, start: addHours(today, 10.5), end: addHours(today, 11), type: 'emergency-only', status: 'available' },
  { id: 's5', doctorId: null, start: addHours(today, 11), end: addHours(today, 11.5), type: 'regular', status: 'blocked', reason: 'Lunch break' },
  { id: 's6', doctorId: null, start: addHours(today, 14), end: addHours(today, 14.5), type: 'regular', status: 'available' },
  { id: 's7', doctorId: null, start: addHours(today, 14.5), end: addHours(today, 15), type: 'regular', status: 'available' },
];

export const DEFAULT_SETTINGS = {
  // Section 1: Basic Information
  fullName: 'Dr. Jane Smith',
  specialization: 'General Physician',
  qualification: 'MBBS, MD',
  experienceYears: 12,
  consultationFee: 500,
  clinicName: 'City Care Clinic',
  // Section 2: Contact Information
  registeredPhone: '+1 555-CLINIC',
  whatsapp: '+1 555-WHATS',
  clinicAddress: '123 Health Ave, Suite 4, City',
  timeZone: 'America/New_York',
  // Section 3: Working Preferences
  workingDays: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
  slotDuration: 30,
  morningStart: '09:00',
  morningEnd: '13:00',
  eveningStart: '17:00',
  eveningEnd: '21:00',
  // Section 4: Emergency Settings
  allowEmergencyOverride: true,
  maxEmergencyPerDay: 5,
  emergencySlotBufferMinutes: 15,
  // Section 5: AI Settings
  supportedLanguages: 'English, Spanish',
  consultationType: 'both',
  onlineMeetingLink: 'https://meet.example.com/dr-smith',
};

export const SLOT_DURATION_OPTIONS = [15, 20, 30, 45, 60];
export const WORKING_DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export const WORKING_DAY_LABELS = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' };
export const CONSULTATION_TYPE_OPTIONS = [
  { value: 'in-person', label: 'In-person' },
  { value: 'online', label: 'Online' },
  { value: 'both', label: 'Both' },
];

export function isWithinTwoHours(appointmentTime) {
  const t = typeof appointmentTime === 'object' && appointmentTime instanceof Date ? appointmentTime : new Date(appointmentTime);
  const diff = t - new Date();
  return diff > 0 && diff < 2 * 60 * 60 * 1000;
}

export function formatTime(d) {
  return new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDayOfWeek(d) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short' });
}
