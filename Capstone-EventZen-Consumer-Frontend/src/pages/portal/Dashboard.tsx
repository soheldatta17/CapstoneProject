import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/store/store";
import PortalLayout from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Ticket, 
  ArrowRight, 
  Star, 
  Clock, 
  Search,
  Zap,
  CheckCircle2,
  TrendingUp,
  Activity,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DashboardStats {
  ticketsSold: number;
  activeEvents: number;
  totalEvents: number;
  revenueGrowth: string;
}

interface Registration {
  _id: string;
  eventId: string | any;
  name: string;
  email: string;
  ticketType: string;
  price: number;
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [billingStats, setBillingStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Check ticket for date";
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [billingRes, eventsRes, regsRes] = await Promise.all([
          api.get("/billing/stats"),
          api.get("/events"),
          api.get("/users/my-events")
        ]);

        setBillingStats(billingRes.data);
        
        // Find the next upcoming event
        const now = new Date();
        const upcoming = eventsRes.data
          .filter((e: any) => new Date(e.eventDate) > now)
          .sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
        
        setNextEvent(upcoming[0] || null);
        setRegistrations(regsRes.data || []);

      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load your latest dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) return null;

  return (
    <PortalLayout>
      <div className="space-y-8 pb-10">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{getGreeting()}, {user.fullName.split(' ')[0]}!</h1>
            <p className="text-muted-foreground mt-1 text-lg">Here's what's happening with your events today.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/events">
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <Search className="w-4 h-4" /> Find New Events
              </Button>
            </Link>
          </motion.div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Main Content Area - Upcoming Booking */}
          <Card className="md:col-span-2 lg:col-span-2 border-border/60 overflow-hidden group">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Next Event
                </CardTitle>
                <CardDescription>Don't miss out on this event</CardDescription>
              </div>
              {nextEvent && <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Upcoming</Badge>}
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="px-6 pb-6 space-y-4 animate-pulse">
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-xl bg-muted shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-6 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ) : nextEvent ? (
                <div className="px-6 py-2 pb-6 space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden shrink-0 shadow-inner">
                      <img 
                        src={nextEvent.coverImage || "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=400&q=80"} 
                        alt={nextEvent.eventTitle} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground leading-tight">{nextEvent.eventTitle}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{nextEvent.location?.title || nextEvent.location} • {formatDate(nextEvent.eventDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-7 h-7 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-bold overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="User" />
                        </div>
                      ))}
                    </div>
                    <Link to={`/book/${nextEvent._id || nextEvent.id}`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5 gap-1.5 p-0 h-auto font-semibold">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-10 text-center space-y-3">
                  <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <p className="text-muted-foreground">No upcoming events found.</p>
                  <Link to="/events">
                    <Button variant="outline" size="sm">Explore Now</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Sidebar */}
          <Card className="md:col-span-1 lg:col-span-2 border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Ticket className="w-4 h-4 text-primary" /> My Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-6 h-6 bg-muted rounded-full" />
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                ))
              ) : registrations.length > 0 ? (
                registrations.map((reg, i) => (
                  <div key={i} className="flex gap-3 items-start group">
                    <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center bg-muted group-hover:bg-primary/5 transition-colors`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 text-primary`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {reg.eventId?.eventTitle || reg.eventId || "Event Registration"}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(reg.createdAt)} • {reg.ticketType}</p>
                    </div>
                    <Link to="/my-tickets">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <ArrowRight className="w-4 h-4" />
                       </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground text-sm italic">
                  You haven't booked any events yet.
                </div>
              )}
              <Link to="/my-tickets" className="block w-full">
                <Button variant="outline" className="w-full mt-2 text-xs h-9">View All Tickets</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Bottom Row Feature Card */}
          <Card className="md:col-span-3 lg:col-span-4 border-none bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-none">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-bold text-foreground tracking-tight">Level up your event experience</h3>
                <p className="text-muted-foreground max-w-lg">Unlock organizer tools to create, manage and scale your events with our premium dashboard and analytics suite.</p>
              </div>
              <Link to="/profile">
                <Button size="lg" className="rounded-full px-8 font-bold gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl shadow-foreground/10">
                  <Zap className="w-5 h-5 fill-current" /> Upgrade Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Dashboard;
