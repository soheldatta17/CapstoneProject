import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PortalLayout from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, MapPin, Clock } from "lucide-react";
import api from "@/services/api";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

interface CalEvent { _id: string; eventTitle: string; eventDate: string; location?: { title: string }; }

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    api.get("/events/calendar")
      .then((r) => setEvents(Array.isArray(r.data) ? r.data : []))
      .catch(console.error);
  }, []);

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const eventsForDay = (day: Date) => events.filter((ev) => isSameDay(new Date(ev.eventDate), day));
  const selectedDayEvents = selectedDay ? eventsForDay(selectedDay) : [];

  return (
    <PortalLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Event Calendar</h1>
            <p className="text-muted-foreground mt-1 text-sm">See all upcoming events at a glance</p>
          </div>
        </div>

        <Card className="border-border/60">
          <CardContent className="pt-6">
            {/* Calendar Nav */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">{format(currentDate, "MMMM yyyy")}</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { setCurrentDate(subMonths(currentDate, 1)); setSelectedDay(null); }}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setCurrentDate(new Date()); setSelectedDay(null); }}>
                  Today
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { setCurrentDate(addMonths(currentDate, 1)); setSelectedDay(null); }}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 mb-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide py-2">{d}</div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 border-t border-l border-border/50">
              {calendarDays.map((day, idx) => {
                const dayEvts = eventsForDay(day);
                const isToday = isSameDay(day, new Date());
                const isThisMonth = isSameMonth(day, currentDate);
                const isSelected = selectedDay && isSameDay(day, selectedDay);
                return (
                  <div
                    key={idx}
                    onClick={() => dayEvts.length > 0 && setSelectedDay(isSameDay(day, selectedDay!) ? null : day)}
                    className={cn(
                      "min-h-[80px] border-b border-r border-border/50 p-1.5 transition-colors",
                      !isThisMonth && "bg-muted/20 opacity-50",
                      dayEvts.length > 0 && "cursor-pointer hover:bg-secondary/50",
                      isSelected && "bg-primary/5"
                    )}
                  >
                    <span className={cn(
                      "inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-medium mb-1",
                      isToday ? "bg-primary text-primary-foreground font-bold" : "text-foreground"
                    )}>
                      {format(day, "d")}
                    </span>
                    <div className="space-y-0.5">
                      {dayEvts.slice(0, 2).map((ev) => (
                        <div key={ev._id} className="text-[0.6rem] bg-primary text-primary-foreground rounded px-1 py-0.5 truncate leading-tight">
                          {format(new Date(ev.eventDate), "HH:mm")} {ev.eventTitle}
                        </div>
                      ))}
                      {dayEvts.length > 2 && (
                        <div className="text-[0.6rem] text-primary font-semibold pl-1">+{dayEvts.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Day Panel */}
        <AnimatePresence>
          {selectedDay && selectedDayEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-border/60 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-primary text-primary-foreground">
                  <h3 className="text-sm font-semibold">{format(selectedDay, "PPPP")}</h3>
                  <button onClick={() => setSelectedDay(null)} className="hover:opacity-70 transition-opacity"><X className="w-4 h-4" /></button>
                </div>
                <div className="divide-y divide-border/50">
                  {selectedDayEvents.map((ev) => (
                    <Link key={ev._id} to={`/events/${ev._id}`} className="flex items-start gap-4 px-5 py-3 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary min-w-[60px]">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(ev.eventDate), "HH:mm")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{ev.eventTitle}</p>
                        {ev.location?.title && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />{ev.location.title}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PortalLayout>
  );
};

export default CalendarView;
