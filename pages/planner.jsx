import React, { useState, useEffect } from "react";
import { ObservationSession, Equipment, LocationProfile } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Camera, Plus, Star } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

import SessionForm from "../components/planner/SessionForm";
import SessionCard from "../components/planner/SessionCard";
import CalendarView from "../components/planner/CalendarView";

export default function Planner() {
  const [sessions, setSessions] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [sessionsData, equipmentData, locationsData] = await Promise.all([
      ObservationSession.list("-planned_date"),
      Equipment.filter({ is_active: true }),
      LocationProfile.list()
    ]);
    
    setSessions(sessionsData);
    setEquipment(equipmentData);
    setLocations(locationsData);
  };

  const handleSaveSession = async (sessionData) => {
    if (editingSession) {
      await ObservationSession.update(editingSession.id, sessionData);
    } else {
      await ObservationSession.create(sessionData);
    }
    setShowForm(false);
    setEditingSession(null);
    loadData();
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setShowForm(true);
  };

  const upcomingSessions = sessions.filter(s => new Date(s.planned_date) >= new Date()).slice(0, 3);
  const pastSessions = sessions.filter(s => new Date(s.planned_date) < new Date());

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold cosmic-text mb-2">
                Observation Planner
              </h1>
              <p className="text-slate-400">Schedule and manage your astrophotography sessions</p>
            </div>
            
            <div className="flex gap-3">
              <div className="flex rounded-lg overflow-hidden border border-slate-700/50">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                  size="sm"
                >
                  List
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  onClick={() => setViewMode("calendar")}
                  className="rounded-none"
                  size="sm"
                >
                  Calendar
                </Button>
              </div>
              
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </div>
          </div>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <SessionForm
              session={editingSession}
              equipment={equipment}
              locations={locations}
              onSave={handleSaveSession}
              onCancel={() => {
                setShowForm(false);
                setEditingSession(null);
              }}
            />
          </motion.div>
        )}

        {viewMode === "calendar" ? (
          <CalendarView sessions={sessions} onEditSession={handleEditSession} />
        ) : (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-200">{sessions.length}</div>
                      <div className="text-sm text-slate-400">Total Sessions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-200">{upcomingSessions.length}</div>
                      <div className="text-sm text-slate-400">Upcoming</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-200">{pastSessions.length}</div>
                      <div className="text-sm text-slate-400">Completed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Sessions */}
            <div>
              <h2 className="text-2xl font-bold mb-4 cosmic-text">Upcoming Sessions</h2>
              <div className="grid gap-4">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <SessionCard 
                        session={session} 
                        equipment={equipment}
                        onEdit={() => handleEditSession(session)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <Card className="glass-card">
                    <CardContent className="p-8 text-center">
                      <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-slate-300 mb-2">No upcoming sessions</h3>
                      <p className="text-slate-400 mb-4">Plan your next astrophotography adventure</p>
                      <Button 
                        onClick={() => setShowForm(true)}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Plan First Session
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Past Sessions */}
            {pastSessions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 cosmic-text">Session History</h2>
                <div className="grid gap-4">
                  {pastSessions.slice(0, 3).map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <SessionCard 
                        session={session} 
                        equipment={equipment}
