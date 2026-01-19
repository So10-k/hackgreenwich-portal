import { useState } from "react";
import { trpc } from "@/lib/trpc-supabase";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import { useSupabaseAuth } from "@/_core/hooks/useSupabaseAuth";
import { format, parseISO, isSameDay } from "date-fns";

export default function Schedule() {
  const { data: events, isLoading } = trpc.schedule.list.useQuery();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [, setLocation] = useLocation();
  const { user } = useSupabaseAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
              <p className="text-white/70">Loading schedule...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Group events by date
  const eventsByDate = events?.reduce((acc: Record<string, any[]>, event: any) => {
    const dateKey = format(parseISO(event.start_time), "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});

  const dates = Object.keys(eventsByDate || {}).sort();

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "workshop":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "meal":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "deadline":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "ceremony":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/hackgreenwich-logo.png" alt="HackGreenwich" className="h-14 cursor-pointer" onClick={() => setLocation("/")} />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => setLocation("/schedule")}
            >
              Schedule
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => setLocation("/sponsors")}
            >
              Sponsors
            </Button>
            {user ? (
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setLocation("/dashboard")}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={() => setLocation("/signin")}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => setLocation("/signup")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-20">
        <div className="container py-12 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">Event Schedule</h1>
            <p className="text-white/80 mt-2">
              Stay on track with all hackathon events, workshops, and deadlines
            </p>
          </div>

        {/* Date Filter */}
        {dates.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedDate(null)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                selectedDate === null
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }`}
            >
              All Days
            </button>
            {dates.map((dateStr) => (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(parseISO(dateStr))}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedDate && format(selectedDate, "yyyy-MM-dd") === dateStr
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                {format(parseISO(dateStr), "MMM d")}
              </button>
            ))}
          </div>
        )}

        {/* Timeline */}
        {events && events.length > 0 ? (
          <div className="space-y-8">
            {dates
              .filter((dateStr) =>
                selectedDate ? format(selectedDate, "yyyy-MM-dd") === dateStr : true
              )
              .map((dateStr) => (
                <div key={dateStr} className="space-y-4">
                  {/* Date Header */}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-bold">
                      {format(parseISO(dateStr), "EEEE, MMMM d, yyyy")}
                    </h2>
                  </div>

                  {/* Events for this date */}
                  <div className="space-y-3 pl-8 border-l-2 border-border">
                    {eventsByDate?.[dateStr]
                      ?.sort(
                        (a: any, b: any) =>
                          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
                      )
                      .map((event: any) => (
                        <Card
                          key={event.id}
                          className={`ml-4 relative ${
                            event.is_important ? "border-primary shadow-md" : ""
                          }`}
                        >
                          {/* Timeline dot */}
                          <div className="absolute -left-[2.15rem] top-6 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>

                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    variant="outline"
                                    className={`${getEventTypeColor(event.event_type)}`}
                                  >
                                    <span className="flex items-center gap-1">
                                      {getEventTypeIcon(event.event_type)}
                                      {event.event_type}
                                    </span>
                                  </Badge>
                                  {event.is_important && (
                                    <Badge variant="destructive">Important</Badge>
                                  )}
                                </div>
                                <CardTitle className="text-xl">{event.title}</CardTitle>
                                {event.description && (
                                  <CardDescription className="mt-2">
                                    {event.description}
                                  </CardDescription>
                                )}
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {format(parseISO(event.start_time), "h:mm a")} -{" "}
                                  {format(parseISO(event.end_time), "h:mm a")}
                                </span>
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Events Scheduled</h3>
                <p className="text-muted-foreground">
                  Check back later for the hackathon schedule
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </div>
  );
}
