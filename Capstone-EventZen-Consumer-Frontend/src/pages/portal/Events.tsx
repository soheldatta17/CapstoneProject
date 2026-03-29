import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector } from "@/store/store";
import PortalLayout from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin } from "lucide-react";
import { BASE_URL } from "@/services/api";
import api from "@/services/api";
import { format } from "date-fns";

interface Event {
  _id: string;
  eventTitle: string;
  eventDate: string;
  location?: { title: string };
  coverImage?: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/events")
      .then((res) => setEvents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PortalLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Upcoming Events</h1>
            <p className="text-muted-foreground mt-1">Browse and register for events</p>
          </div>
          <Link to="/calendar" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <Calendar className="w-4 h-4" /> Calendar View
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No events scheduled yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, idx) => {
              const coverImg = event.coverImage
                ? event.coverImage.startsWith("/uploads") ? `${BASE_URL}${event.coverImage}` : event.coverImage
                : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80";

              const isPast = new Date(event.eventDate) < new Date();

              return (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="overflow-hidden h-full border-border/60 hover:shadow-lg transition-all duration-200">
                    <div className="relative h-48 overflow-hidden">
                      <img src={coverImg} alt={event.eventTitle} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                      {isPast && (
                        <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                          <Badge variant="secondary" className="text-xs font-semibold">Ended</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-base text-foreground mb-2 line-clamp-2">{event.eventTitle}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        {format(new Date(event.eventDate), "EEE, MMM d, yyyy 'at' h:mm a")}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {event.location?.title || "Online"}
                      </div>
                      <Link
                        to={`/events/${event._id}`}
                        className="block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        View Details
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </PortalLayout>
  );
};

export default Events;
