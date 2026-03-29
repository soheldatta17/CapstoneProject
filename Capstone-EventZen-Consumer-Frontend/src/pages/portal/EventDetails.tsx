import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppSelector } from "@/store/store";
import PortalLayout from "@/components/portal/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, ArrowLeft, Send, X } from "lucide-react";
import { BASE_URL } from "@/services/api";
import api from "@/services/api";
import { format } from "date-fns";

interface Speaker { name: string; role?: string; image?: string; }
interface Comment { _id: string; author: string; text: string; avatar?: string; createdAt: string; }
interface EventDetail {
  _id: string; eventTitle: string; eventDate: string; description?: string;
  location?: { title: string; address?: string };
  coverImage?: string; promoVideo?: string;
  speakers?: Speaker[];
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppSelector((state) => state.auth);
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchComments = () => api.get(`/events/${id}/comments`).then((r) => setComments(r.data));

  useEffect(() => {
    Promise.all([
      api.get(`/events/${id}`),
      api.get(`/events/${id}/comments`),
    ])
      .then(([evRes, cmRes]) => { setEvent(evRes.data); setComments(cmRes.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setPosting(true);
    try {
      await api.post(`/events/${id}/comments`, {
        author: user.fullName, text: newComment,
        userId: user.id || user._id, avatar: user.avatar || "",
      });
      setNewComment("");
      fetchComments();
    } finally { setPosting(false); }
  };

  if (loading) return (
    <PortalLayout>
      <Skeleton className="w-full h-72 rounded-xl mb-6" />
      <Skeleton className="h-8 w-1/2 mb-3" />
      <Skeleton className="h-4 w-1/3" />
    </PortalLayout>
  );

  if (!event) return (
    <PortalLayout>
      <div className="text-center py-20">
        <p className="text-muted-foreground">Event not found.</p>
        <Link to="/events" className="text-primary hover:underline mt-3 block">Back to Events</Link>
      </div>
    </PortalLayout>
  );

  const eventDate = new Date(event.eventDate);
  const isPast = eventDate < new Date();
  const coverImg = event.coverImage
    ? event.coverImage.startsWith("/uploads") ? `${BASE_URL}${event.coverImage}` : event.coverImage
    : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1600&q=80";

  return (
    <PortalLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

        {/* Hero */}
        <div className="rounded-2xl overflow-hidden h-72 md:h-96 relative">
          <img src={coverImg} alt={event.eventTitle} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">{event.eventTitle}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />{format(eventDate, "EEEE, MMMM d, yyyy 'at' h:mm a")}</span>
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{event.location?.title || "TBA"}{event.location?.address && ` — ${event.location.address}`}</span>
              </div>
            </div>

            {event.description && (
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <h2 className="text-base font-semibold mb-3 text-foreground">About this event</h2>
                  <div className="text-sm text-muted-foreground leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{ __html: event.description }} />
                </CardContent>
              </Card>
            )}

            {event.speakers && event.speakers.length > 0 && (
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <h2 className="text-base font-semibold mb-4 text-foreground">Speakers</h2>
                  <div className="space-y-3">
                    {event.speakers.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40">
                        <img src={s.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random&color=fff`} alt={s.name} className="w-10 h-10 rounded-full object-cover" onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random`)} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.role || "Guest Speaker"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {event.promoVideo && (
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <h2 className="text-base font-semibold mb-3 text-foreground">Promotional Video</h2>
                  <video src={event.promoVideo.startsWith("/uploads") ? `${BASE_URL}${event.promoVideo}` : event.promoVideo} controls className="w-full rounded-xl max-h-72 bg-black" />
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <Card className="border-border/60">
              <CardContent className="pt-6">
                <h2 className="text-base font-semibold mb-4 text-foreground">Comments</h2>
                <form onSubmit={handlePostComment} className="flex gap-3 mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={2}
                    className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex flex-col gap-2">
                    <Button type="submit" size="icon" disabled={!newComment.trim() || posting} className="h-9 w-9" aria-label="Post">
                      <Send className="w-4 h-4" />
                    </Button>
                    {newComment && (
                      <Button type="button" size="icon" variant="ghost" className="h-9 w-9" onClick={() => setNewComment("")}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </form>

                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-4">No comments yet. Be the first!</p>
                  ) : (
                    comments.map((c) => {
                      const avatar = c.avatar
                        ? c.avatar.startsWith("http") ? c.avatar : `${BASE_URL}/uploads/${c.avatar.replace(/^\//, "")}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.author)}&background=random&color=fff`;
                      return (
                        <div key={c._id} className="flex gap-3">
                          <img src={avatar} alt={c.author} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          <div className="flex-1 bg-secondary/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-foreground">{c.author}</span>
                              <span className="text-xs text-muted-foreground">{format(new Date(c.createdAt), "MMM d")}</span>
                            </div>
                            <p className="text-sm text-foreground/80">{c.text}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card className="border-border/60">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">{isPast ? "This event has ended." : "Reserve your seat now!"}</p>
                  {isPast ? (
                    <Button disabled variant="secondary" className="w-full">Event Ended</Button>
                  ) : (
                    <Link to={`/book/${event._id}`}>
                      <Button className="w-full gap-2">Proceed to Booking →</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </PortalLayout>
  );
};

export default EventDetails;
