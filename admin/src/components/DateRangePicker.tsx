import ReactDatePicker from 'react-datepicker';
import { CalendarDays, X } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
}

function toDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function toStr(d: Date | null): string {
  if (!d) return '';
  // local date string yyyy-mm-dd
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fmtDisplay(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Cast to any to avoid selectsRange overload conflict in TS
const DP = ReactDatePicker as any;

export default function DateRangePicker({ checkIn, checkOut, onChange }: Props) {
  const startDate = toDate(checkIn);
  const endDate   = toDate(checkOut);

  const label = () => {
    if (startDate && endDate) return `${fmtDisplay(startDate)}  →  ${fmtDisplay(endDate)}`;
    if (startDate)            return `${fmtDisplay(startDate)}  →  Pick checkout`;
    return 'Select check-in & check-out';
  };

  return (
    <div className="w-full">
      <style>{`
        .rdp-wrap .react-datepicker-wrapper,
        .rdp-wrap .react-datepicker__input-container { width: 100%; }

        .react-datepicker-popper { z-index: 9999 !important; }

        .react-datepicker {
          font-family: 'Manrope', sans-serif !important;
          font-size: 13px !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 16px !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.13) !important;
          overflow: hidden;
        }
        .react-datepicker__month-container { padding: 10px 12px 12px; }
        .react-datepicker__header {
          background: #fff !important;
          border-bottom: 1px solid #f3f4f6 !important;
          border-radius: 0 !important;
          padding: 10px 0 6px !important;
        }
        .react-datepicker__current-month {
          font-size: 13px !important; font-weight: 700 !important; color: #111827 !important;
        }
        .react-datepicker__day-name {
          width: 34px !important; line-height: 28px !important;
          font-size: 11px !important; font-weight: 600 !important; color: #9ca3af !important;
        }
        .react-datepicker__day {
          width: 34px !important; height: 34px !important; line-height: 34px !important;
          border-radius: 8px !important; font-size: 13px !important;
          color: #374151 !important; margin: 1px !important;
        }
        .react-datepicker__day:hover:not(.react-datepicker__day--disabled) {
          background: #faefd9 !important; color: #b86e1f !important;
        }
        .react-datepicker__day--range-start,
        .react-datepicker__day--range-end,
        .react-datepicker__day--selected {
          background: #d4882a !important; color: #fff !important; font-weight: 700 !important;
        }
        .react-datepicker__day--range-start { border-radius: 8px 0 0 8px !important; }
        .react-datepicker__day--range-end   { border-radius: 0 8px 8px 0 !important; }
        .react-datepicker__day--range-start.react-datepicker__day--range-end {
          border-radius: 8px !important;
        }
        .react-datepicker__day--in-range {
          background: #faefd9 !important; color: #b86e1f !important; border-radius: 0 !important;
        }
        .react-datepicker__day--in-selecting-range:not(.react-datepicker__day--range-start) {
          background: #faefd9 !important; color: #b86e1f !important;
        }
        .react-datepicker__day--today:not(.react-datepicker__day--selected):not(.react-datepicker__day--in-range) {
          color: #d4882a !important; font-weight: 800 !important;
        }
        .react-datepicker__day--disabled { color: #d1d5db !important; cursor: not-allowed !important; }
        .react-datepicker__navigation-icon::before { border-color: #9ca3af !important; }
        .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
          border-color: #d4882a !important;
        }
        .react-datepicker__triangle { display: none !important; }
        .react-datepicker__month--selecting-range .react-datepicker__day--in-range:not(.react-datepicker__day--in-selecting-range) {
          background: #faefd9 !important; color: #b86e1f !important;
        }
      `}</style>

      <div className="rdp-wrap">
        <DP
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={([start, end]: [Date | null, Date | null]) => {
            onChange(toStr(start), toStr(end ?? null));
          }}
          minDate={new Date()}
          monthsShown={2}
          dateFormat="MMM d, yyyy"
          customInput={
            <button
              type="button"
              className="w-full flex items-center gap-2 border rounded-xl px-3 py-2.5 text-sm bg-white transition-colors text-left"
              style={{ borderColor: startDate ? '#e4a43e' : '#e5e7eb' }}
            >
              <CalendarDays size={15} className="text-gray-400 shrink-0" />
              <span className={`flex-1 truncate ${startDate ? 'text-gray-800' : 'text-gray-400'}`}>
                {label()}
              </span>
              {(startDate || endDate) && (
                <X
                  size={14}
                  className="text-gray-400 hover:text-gray-600 shrink-0"
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); onChange('', ''); }}
                />
              )}
            </button>
          }
          popperPlacement="bottom-start"
          popperModifiers={[
            { name: 'offset', options: { offset: [0, 8] } } as any,
            { name: 'preventOverflow', options: { padding: 16 } } as any,
          ]}
        />
      </div>
    </div>
  );
}
