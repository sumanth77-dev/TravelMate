import { Booking } from "@/types/guide";
import { Clock, CheckCircle2, XCircle, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

interface BookingCardProps {
  booking: Booking;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-warning/10 text-warning",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-success/10 text-success",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive",
  },
};

const BookingCard = ({ booking }: BookingCardProps) => {
  const config = statusConfig[booking.status];
  const Icon = config.icon;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground">{booking.guideName}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{booking.location}</p>
        </div>
        <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
          <Icon className="h-3.5 w-3.5" />
          {config.label}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3 text-sm">
        <div>
          <span className="text-xs text-muted-foreground">Date</span>
          <p className="font-medium">{new Date(booking.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Duration</span>
          <p className="font-medium">{booking.duration}h</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Members</span>
          <p className="font-medium">{booking.members}</p>
        </div>
        <div>
          <span className="text-xs text-muted-foreground">Total</span>
          <p className="font-medium">₹{booking.totalPrice.toLocaleString()}</p>
        </div>
      </div>
      {booking.message && (
        <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">{booking.message}</p>
      )}
      {booking.status === "approved" && (
        <Link
          to={`/payment/${booking.id}`}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <CreditCard className="h-4 w-4" />
          Pay Now
        </Link>
      )}
    </div>
  );
};

export default BookingCard;
