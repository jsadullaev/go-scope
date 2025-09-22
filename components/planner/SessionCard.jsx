import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Camera, 
  Star, 
  Edit,
  Target
} from "lucide-react";
import { format } from "date-fns";

export default function SessionCard({ session, equipment, onEdit, isPast = false }) {
  const sessionEquipment = equipment.filter(eq => 
    session.equipment_ids?.includes(eq.id)
  );

  const getSessionTypeColor = (type) => {
    const colors = {
      astrophotography: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      visual_observation: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      planetary: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      deep_sky: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      milky_way: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
    };
    return colors[type] || colors.astrophotography;
  };

  const getStatusColor = (status) => {
    const colors = {
      planned: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      in_progress: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      completed: "bg-green-500/20 text-green-300 border-green-500/30",
      cancelled: "bg-red-500/20 text-red-300 border-red-500/30"
    };
    return colors[status] || colors.planned;
  };

  return (
    <Card className={`glass-card hover:border-indigo-500/40 transition-all duration-300 ${isPast ? 'opacity-80' : ''}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-slate-200">{session.title}</h3>
              <Badge className={getSessionTypeColor(session.session_type)}>
                {session.session_type?.replace('_', ' ')}
              </Badge>
              <Badge className={getStatusColor(session.status)}>
                {session.status || 'planned'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>{format(new Date(session.planned_date), 'MMM d, yyyy')}</span>
              </div>
              
              {session.start_time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{session.start_time} - {session.end_time}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>{session.location_name || 'Location TBD'}</span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(session)}
            className="text-slate-400 hover:text-slate-200"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        {/* Target Objects */}
        {session.target_objects?.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-slate-300">Target Objects</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {session.target_objects.map((target) => (
                <span 
                  key={target}
                  className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs border border-yellow-500/30"
                >
                  {target}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Equipment */}
        {sessionEquipment.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-slate-300">Equipment</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sessionEquipment.slice(0, 3).map((item) => (
                <span 
                  key={item.id}
                  className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs border border-green-500/30"
                >
                  {item.name}
                </span>
              ))}
              {sessionEquipment.length > 3 && (
                <span className="bg-slate-500/20 text-slate-300 px-2 py-1 rounded text-xs border border-slate-500/30">
                  +{sessionEquipment.length - 3} more
                </span>
              )}
            </div>
          </div>
 
