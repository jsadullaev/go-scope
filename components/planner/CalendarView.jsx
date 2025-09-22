import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";

export default function CalendarView({ sessions, onEditSession }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getSessionsForDay = (date) => {
    return sessions.filter(session => 
      isSameDay(new Date(session.planned_date), date)
    );
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getSessionTypeColor = (type) => {
    const colors = {
      astrophotography: "bg-indigo-500",
      visual_observation: "bg-emerald-500",
      planetary: "bg-orange-500",
      deep_sky: "bg-purple-500",
      milky_way: "bg-cyan-500"
    };
    return colors[type] || colors.astrophotography;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            {format(currentDate, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(-1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth(1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-slate-400">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const daySessions = getSessionsForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div
                key={day.toISOString()}
                className={`min-h-24 p-2 border border-slate-700/30 rounded-lg transition-all duration-200 ${
                  isCurrentMonth ? 'bg-slate-800/20' : 'bg-slate-800/10 opacity-50'
                } ${isToday ? 'ring-2 ring-indigo-500 bg-indigo-500/10' : ''} hover:bg-slate-700/30`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-indigo-400' : 'text-slate-300'
                }`}>
                  {format(day, 'd')}
                </div>

                <div className="space-y-1">
                  {daySessions.slice(0, 2).map((session) => (
                    <div
                      key={session.id}
                      onClick={() => onEditSession(session)}
                      className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getSessionTypeColor(session.session_type)} text-white truncate`}
                      title={session.title}
                    >
                      {session.title}
                    </div>
                  ))}
                  {daySessions.length > 2 && (
                    <div className="text-xs text-slate-400 px-1">
                      +{daySessions.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
