import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Booking } from "@/types/guide";
import { sampleBookings } from "@/data/guides";
import Header from "@/components/Header";
import { ArrowLeft, CreditCard, CheckCircle2, Lock } from "lucide-react";
import { toast } from "sonner";

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("bookings");
    const bookings: Booking[] = stored ? JSON.parse(stored) : sampleBookings;
    const found = bookings.find((b) => b.id === bookingId);
    setBooking(found || null);
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Booking not found.</p>
        </div>
      </div>
    );
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !name) {
      toast.error("Please fill in all payment details");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaid(true);
      toast.success("Payment successful!");
    }, 1500);
  };

  if (paid) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-md px-4 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Payment Successful!</h1>
          <p className="mt-2 text-muted-foreground">
            Your booking with {booking.guideName} is confirmed. ₹{booking.totalPrice.toLocaleString()} has been charged.
          </p>
          <button
            onClick={() => navigate("/bookings")}
            className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            View Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto max-w-md px-4 py-8">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Payment</h1>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 mb-6">
            <p className="text-sm font-medium text-foreground">{booking.guideName}</p>
            <p className="text-xs text-muted-foreground">{booking.location} · {new Date(booking.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span className="text-sm text-muted-foreground">Total Amount</span>
              <span className="text-lg font-bold text-foreground">₹{booking.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              Your payment information is secure
            </div>

            <button
              type="submit"
              disabled={processing}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <CreditCard className="h-4 w-4" />
              {processing ? "Processing..." : `Pay ₹${booking.totalPrice.toLocaleString()}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
