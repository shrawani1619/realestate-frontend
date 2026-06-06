import { BOOKING_STATUS } from '@/constants/css';
import { Booking } from '@/lib/types';

interface StatusBadgeProps {
  status: Booking['status'];
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${BOOKING_STATUS[status]}`}
    >
      {status}
    </span>
  );
}
