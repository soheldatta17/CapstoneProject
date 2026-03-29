import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/store/store";
import PortalLayout from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Calendar } from "lucide-react";
import api from "@/services/api";
import { format } from "date-fns";
import { toast } from "sonner";

interface Registration {
  _id: string;
  ticketType: "VIP" | "Premium" | "General";
  seatNumber: string;
  rating?: number;
  eventId: {
    _id: string; eventTitle: string; eventDate: string;
    location?: { title: string };
  } | null;
}

interface RatingModal { show: boolean; eventId: string; title: string; rating: number; review: string; }

const MyTickets = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<RatingModal>({ show: false, eventId: "", title: "", rating: 0, review: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = () =>
    api.get("/users/my-events")
      .then((r) => setRegistrations(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { if (token) load(); }, [token]);

  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modal.rating === 0) { toast.error("Please select a star rating."); return; }
    setSubmitting(true);
    try {
      await api.post(`/events/${modal.eventId}/rate`, { rating: modal.rating, review: modal.review.trim() });
      toast.success("Rating submitted!");
      setModal({ show: false, eventId: "", title: "", rating: 0, review: "" });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to submit rating.");
    } finally { setSubmitting(false); }
  };

  const tierBadge: Record<string, string> = {
    VIP: "text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300",
    Premium: "text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border-cyan-300",
    General: "text-muted-foreground bg-secondary border-border",
  };

  return (
    <PortalLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-8">My Tickets</h1>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-border/60"><CardContent className="pt-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
            ))}
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">You haven't booked any events yet.</div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg, idx) => {
              const ev = reg.eventId;
              if (!ev) return null;
              const eventDate = new Date(ev.eventDate);
              const isPast = eventDate < new Date();
              return (
                <motion.div key={reg._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                  <Card className="border-border/60 hover:shadow-md transition-shadow">
                    <CardContent className="pt-0">
                      {/* Ticket Header */}
                      <div className="flex items-center justify-between border-b border-dashed border-border px-0 py-3 mb-4">
                        <span className="text-xs text-muted-foreground font-mono">ID: {reg._id.slice(0, 8).toUpperCase()}</span>
                        <Badge className={`text-xs font-semibold border ${tierBadge[reg.ticketType] || tierBadge.General}`}>
                          {reg.ticketType} TICKET
                        </Badge>
                      </div>

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-base text-foreground mb-2">{ev.eventTitle}</h3>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5 shrink-0" />
                              {format(eventDate, "EEE, MMM d, yyyy 'at' h:mm a")}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              {ev.location?.title || "TBA"}
                            </div>
                          </div>
                          <div className="mt-4">
                            {isPast ? (
                              reg.rating ? (
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < reg.rating! ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
                                  ))}
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2 border-yellow-400/50 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/30"
                                  onClick={() => setModal({ show: true, eventId: ev._id, title: ev.eventTitle, rating: 0, review: "" })}
                                >
                                  <Star className="w-3.5 h-3.5" /> Rate Event
                                </Button>
                              )
                            ) : (
                              <Badge variant="outline" className="text-xs text-success dark:text-green-400 border-success/30 bg-success/5">Upcoming</Badge>
                            )}
                          </div>
                        </div>

                        {/* Seat Badge */}
                        <div className="shrink-0 text-center border-2 border-primary/30 rounded-xl p-3 bg-primary/5">
                          <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Your Seat</p>
                          <p className="text-xl font-bold text-primary font-mono">{reg.seatNumber}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Rating Modal */}
      {modal.show && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
            <Card className="w-full max-w-sm border-border/60 shadow-2xl">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-1">Rate this event</h3>
                <p className="text-sm text-muted-foreground mb-5">{modal.title}</p>
                <div className="flex gap-2 justify-center mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" onClick={() => setModal({ ...modal, rating: i + 1 })} className="transition-transform hover:scale-125">
                      <Star className={`w-8 h-8 ${i < modal.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={modal.review}
                  onChange={(e) => setModal({ ...modal, review: e.target.value })}
                  placeholder="Leave a review (optional)..."
                  rows={3}
                  className="w-full mb-5 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" onClick={() => setModal({ show: false, eventId: "", title: "", rating: 0, review: "" })}>Cancel</Button>
                  <Button onClick={handleRateSubmit} disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </PortalLayout>
  );
};

export default MyTickets;
