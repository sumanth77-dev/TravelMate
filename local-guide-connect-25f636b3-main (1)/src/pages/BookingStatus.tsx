import { useState, useEffect } from "react";
import { sampleBookings } from "@/data/guides";
import { Booking } from "@/types/guide";
import Header from "@/components/Header";
import BookingCard from "@/components/BookingCard";
import { Calendar } from "lucide-react";

const BookingStatus = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    const stored = localStorage.getItem("bookings");
    if (stored) {
      setBookings(JSON.parse(stored));
    } else {
      setBookings(sampleBookings);
    }
  }, []);

  const filtered = activeTab === "all" ? bookings : bookings.filter((b) => b.status === activeTab);

  const tabs = [
    { key: "all" as const, label: "All" },
    { key: "pending" as const, label: "Pending" },
    { key: "approved" as const, label: "Approved" },
    { key: "rejected" as const, label: "Rejected" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track all your guide booking requests</p>

        <div className="mt-6 flex gap-1 rounded-lg bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 text-center">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground">No bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStatus;
