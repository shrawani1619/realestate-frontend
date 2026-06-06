import { INQUIRY_STATUS } from '@/constants/css';
import { Inquiry } from '@/lib/types';

interface InquiryStatusBadgeProps {
  status: Inquiry['status'];
}

export default function InquiryStatusBadge({ status }: InquiryStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${INQUIRY_STATUS[status]}`}
    >
      {status}
    </span>
  );
}
