import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector } from "@/store/store";
import PortalLayout from "@/components/portal/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard } from "lucide-react";
import api from "@/services/api";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Venue { _id: string; rows: number; cols: number; }
interface EventData { _id: string; eventTitle: string; eventDate: string; location?: { title: string }; venue?: string | { _id: string }; }

type TierType = "VIP" | "Premium" | "General";
const getTierInfo = (rowLabel: string): { type: TierType; price: number } => {
  const rowIdx = rowLabel.charCodeAt(0) - 65;
  if (rowIdx < 2) return { type: "VIP", price: 150 };
  if (rowIdx < 4) return { type: "Premium", price: 100 };
  return { type: "General", price: 50 };
};

const tierStyle: Record<TierType, string> = {
  VIP: "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400",
  Premium: "border-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400",
  General: "border-primary/40 bg-background text-foreground",
};

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventData | null>(null);
  const [venueData, setVenueData] = useState<Venue | null>(null);
  const [occupied, setOccupied] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/events/${id}`),
      api.get(`/events/${id}/occupied-seats`),
      api.get("/venues"),
    ])
      .then(([evRes, occRes, venRes]) => {
        const ev = evRes.data;
        setEvent(ev);
        setOccupied(occRes.data);
        if (ev.venue) {
          const venueId = typeof ev.venue === "object" ? ev.venue._id : ev.venue;
          const match = venRes.data.find((v: Venue) => v._id === venueId);
          setVenueData(match || null);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !venueData || !user || booking) return;
    const tier = getTierInfo(selected.split("-")[0]);
    setBooking(true);
    try {
      await api.post(`/events/${id}/register`, {
        name: user.fullName, email: user.workEmail || user.email,
        ticketType: tier.type, seatNumber: selected,
        venueId: venueData._id, avatar: user.avatar || "",
        userId: user.id || user._id, price: tier.price,
      });
      toast.success("Booking confirmed! Redirecting to your tickets...");
      setTimeout(() => navigate("/my-tickets"), 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <PortalLayout>
      <Skeleton className="h-8 w-56 mb-6" />
      <Skeleton className="w-full h-64 rounded-xl" />
    </PortalLayout>
  );

  if (!event || !venueData) return (
    <PortalLayout>
      <div className="text-center py-20">
        <p className="text-muted-foreground">No venue seating configured for this event.</p>
        <Link to="/events" className="text-primary hover:underline mt-3 block">Back to Events</Link>
      </div>
    </PortalLayout>
  );

  const selectedTier = selected ? getTierInfo(selected.split("-")[0]) : null;

  return (
    <PortalLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
        <Link to={`/events/${event._id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Event
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{event.eventTitle}</h1>
          <p className="text-sm text-muted-foreground mt-1">{format(new Date(event.eventDate), "EEEE, MMMM d, yyyy 'at' h:mm a")} @ {event.location?.title || "TBA"}</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {(["VIP", "Premium", "General", "Selected", "Occupied"] as const).map((label) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={cn("w-3 h-3 rounded border",
                label === "VIP" ? "bg-yellow-50 border-yellow-400" :
                label === "Premium" ? "bg-cyan-50 border-cyan-400" :
                label === "General" ? "bg-background border-primary/40" :
                label === "Selected" ? "bg-primary border-primary" :
                "bg-muted border-muted-foreground/30"
              )} />
              {label}
            </span>
          ))}
        </div>

        {/* Stage */}
        <div className="w-3/4 mx-auto py-2.5 bg-foreground/90 text-background text-xs font-bold tracking-widest uppercase text-center rounded-b-3xl shadow-lg">
          STAGE / PODIUM
        </div>

        {/* Seat Map */}
        <Card className="border-border/60 overflow-auto">
          <CardContent className="pt-6 pb-8">
            <div
              className="grid gap-1.5 mx-auto w-fit"
              style={{ gridTemplateColumns: `repeat(${venueData.cols}, 2.25rem)` }}
            >
              {Array.from({ length: venueData.rows }).flatMap((_, r) => {
                const rowLabel = String.fromCharCode(65 + r);
                const { type: tier } = getTierInfo(rowLabel);
                return Array.from({ length: venueData.cols }).map((_, c) => {
                  const seatId = `${rowLabel}-${c + 1}`;
                  const isOccupied = occupied.includes(seatId);
                  const isSelected = selected === seatId;
                  return (
                    <button
                      key={seatId}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => !isOccupied && setSelected(isSelected ? null : seatId)}
                      className={cn(
                        "w-9 h-9 text-[0.6rem] font-medium rounded border transition-all",
                        isSelected ? "bg-primary border-primary text-primary-foreground shadow-md scale-110" :
                        isOccupied ? "bg-muted border-muted-foreground/20 text-muted-foreground/50 cursor-not-allowed" :
                        tierStyle[tier],
                        !isOccupied && !isSelected && "hover:scale-105 hover:shadow-sm cursor-pointer"
                      )}
                    >
                      {seatId}
                    </button>
                  );
                });
              })}
            </div>
          </CardContent>
        </Card>

        {/* Confirm Form */}
        <form onSubmit={handleBook} className="max-w-md mx-auto">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">Confirm Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTier && selected && (
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Seat</span><span className="font-semibold">{selected}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Category</span><Badge variant="outline">{selectedTier.type}</Badge></div>
                  <div className="flex justify-between border-t border-border/50 pt-2"><span className="text-muted-foreground">Price</span><span className="font-bold text-primary text-base">₹{selectedTier.price}</span></div>
                </div>
              )}

              <div className="flex items-center gap-2 rounded-lg bg-muted/40 border border-border p-3 text-sm text-muted-foreground">
                <CreditCard className="w-4 h-4 shrink-0" />
                <span><strong>Payment:</strong> Saved Card</span>
              </div>

              <Button type="submit" className="w-full" disabled={!selected || booking}>
                {booking ? "Confirming..." : "Reserve Seat Now"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </motion.div>
    </PortalLayout>
  );
};

export default Booking;
