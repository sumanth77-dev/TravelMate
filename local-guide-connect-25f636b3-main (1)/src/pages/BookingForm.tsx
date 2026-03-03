import { useParams, useNavigate, Link } from "react-router-dom";
import { guides, sampleBookings } from "@/data/guides";
import { Booking } from "@/types/guide";
import Header from "@/components/Header";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const BookingForm = () => {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const guide = guides.find((g) => g.id === guideId);

  const [date, setDate] = useState("");
  const [duration, setDuration] = useState(2);
  const [members, setMembers] = useState(1);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!guide) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Guide not found.</p>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">Back to search</Link>
        </div>
      </div>
    );
  }

  const pricePerHour = Math.round(guide.pricePerDay / 8);
  const totalPrice = pricePerHour * duration;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    setSubmitting(true);

    // Simulate submission
    const newBooking: Booking = {
      id: `b${Date.now()}`,
      guideId: guide.id,
      guideName: guide.name,
      location: guide.location,
      date,
      duration,
      members,
      status: "pending",
      totalPrice,
      message,
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Store in localStorage for demo
    const existing = JSON.parse(localStorage.getItem("bookings") || "null") || sampleBookings;
    localStorage.setItem("bookings", JSON.stringify([newBooking, ...existing]));

    setTimeout(() => {
      toast.success("Booking request sent!");
      navigate("/bookings");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto max-w-lg px-4 py-8">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h1 className="text-xl font-bold text-foreground">Book {guide.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{guide.location}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Tour Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Duration (hours)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
                  <option key={n} value={n}>{n} hour{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Members</label>
              <select
                value={members}
                onChange={(e) => setMembers(Number(e.target.value))}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n} member{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Message to Guide</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Tell the guide about your interests or any special requests..."
                className="w-full resize-none rounded-lg border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">₹{pricePerHour.toLocaleString()}/hr × {duration}h</span>
                <span className="font-semibold text-foreground">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Sending..." : "Send Booking Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
