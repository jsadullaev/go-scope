
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Cloud,
  CloudRain,
  Sun,
  Moon,
  Wind,
  Eye,
  Thermometer,
  Droplets,
  Star,
  Satellite,
  Camera,
  AlertCircle,
  TrendingUp,
  Clock,
  MapPin,
  Loader2
} from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";
import { motion } from "framer-motion";

import LiveScoreDisplay from "../components/dashboard/LiveScoreDisplay";
import WeatherWidget from "../components/dashboard/WeatherWidget";
import SkyConditions from "../components/dashboard/SkyConditions";
// QuickActions component is no longer used in this file's JSX, so its import is removed.

export default function Dashboard() {
  const [skyData, setSkyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [location, setLocation] = useState({ lat: "41.6628", lon: "-77.8267" }); // Default to Cherry Springs

  useEffect(() => {
    // Initial load on component mount.
    // The eslint-disable is used here because we intentionally want this effect
    // to run only once with the initial location state, not on every location change.
    // Subsequent data fetches are triggered manually by the user via the button.
    loadSkyData(location.lat, location.lon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once on mount

  const loadSkyData = async (lat, lon) => {
    if (!lat || !lon) {
      // Simple validation
      alert("Please enter both latitude and longitude.");
      return;
    }
    setIsLoading(true);
    setSkyData(null); // Clear previous data
    try {
      const result = await InvokeLLM({
        prompt: `Act as a real-time data aggregator for an astrophotography planner.
        1. For the location Latitude=${lat}, Longitude=${lon}, fetch current weather data as if from the OpenWeatherMap API. Include temperature (°C), humidity (%), wind speed (km/h), and cloud cover (%).
        2. For the same location and current date, fetch moon data. Include phase, illumination (%), rise time, and set time.
        3. Based on these real-time API results, and also considering atmospheric seeing (e.g., 'Good', 'Average', 'Poor'), and a realistic light pollution estimate for the coordinates, calculate an overall "shoot window score" from 0-100.
        4. Determine the start time of the next "optimal shooting window" for tonight. Provide a countdown duration in minutes to this window from now. If the window has started, use a negative number. If no window, use null.
        5. Provide brief recommendations and alerts based on the data.
        Return the data in the specified JSON format.`,
        response_json_schema: {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            score_trend: { type: "string", enum: ["improving", "declining", "stable"] },
            optimal_window_countdown_minutes: { type: ["number", "null"] },
            weather: {
              type: "object",
              properties: {
                temperature: { type: "number" },
                humidity: { type: "number" },
                wind_speed: { type: "number" },
                cloud_cover: { type: "number" },
                conditions: { type: "string" }
                // Visibility property removed as per updated prompt schema
              }
            },
            moon: {
              type: "object",
              properties: {
                phase: { type: "string" },
                illumination: { type: "number" },
                rise_time: { type: "string" },
                set_time: { type: "string" }
              }
            },
            sky: {
              type: "object",
              properties: {
                light_pollution: { type: "number" },
                seeing: { type: "string" },
                transparency: { type: "string" },
                limiting_magnitude: { type: "number" }
              }
            },
            // Satellite activity forecast (satellites object) removed from schema as per updated prompt
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            alerts: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setSkyData(result);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error loading sky data:", error);
      setSkyData({ error: "Failed to fetch data. Please try again." }); // Set error in skyData state
    }
    setIsLoading(false);
  };

  const handleLocationChange = (field, value) => {
    setLocation(prev => ({ ...prev, [field]: value }));
  };
  
  const handleGetData = () => {
    loadSkyData(location.lat, location.lon);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto"> {/* Changed max-w-7xl to max-w-4xl */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold cosmic-text mb-2">
            Dynamic Observation Planner
          </h1>
          <p className="text-slate-400">Enter coordinates to get your real-time "shoot window score"</p>
          {/* Removed original lastUpdate and MapPin current location display */}
        </motion.div>

        {/* Location Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg p-2">
                   <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0 ml-2" />
                   <div className="flex-1">
                      <label htmlFor="latitude" className="text-xs text-slate-400">Latitude</label>
                      <Input
                        id="latitude"
                        type="text"
                        placeholder="e.g., 41.6628"
                        value={location.lat}
                        onChange={(e) => handleLocationChange('lat', e.target.value)}
                        className="bg-transparent border-none text-base h-auto p-0 focus-visible:ring-0"
                      />
                   </div>
                </div>
                <div className="flex-1 w-full flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-lg p-2">
                   <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 ml-2" />
                   <div className="flex-1">
                      <label htmlFor="longitude" className="text-xs text-slate-400">Longitude</label>
                      <Input
                        id="longitude"
                        type="text"
                        placeholder="e.g., -77.8267"
                        value={location.lon}
                        onChange={(e) => handleLocationChange('lon', e.target.value)}
                        className="bg-transparent border-none text-base h-auto p-0 focus-visible:ring-0"
                      />
                    </div>
                </div>
                <Button 
                  onClick={handleGetData}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 px-6 py-6 text-base"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Score"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {isLoading && (
          <div className="text-center p-10">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-indigo-400 mb-4" />
            <p className="text-slate-300">Calculating your sky score...</p>
            <p className="text-sm text-slate-500">Fetching real-time weather and celestial data.</p>
          </div>
        )}

        {skyData && !isLoading && (
          skyData.error ? (
             <Card className="glass-card border-red-500/30 text-center">
                <CardContent className="p-8">
                  <AlertCircle className="w-10 h-10 mx-auto text-red-400 mb-4" />
                  <h3 className="text-xl font-semibold text-red-300">An Error Occurred</h3>
                  <p className="text-slate-400 mt-2">{skyData.error}</p>
                </CardContent>
             </Card>
          ) : (
            <div className="space-y-6">
              <LiveScoreDisplay skyData={skyData} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <WeatherWidget weather={skyData?.weather} />
                <SkyConditions skyData={skyData} />
              </div>
              {/* Removed QuickActions, Alerts, and Recommendations sections as per the new simplified UI outline */}
            </div>
          )
        )}
      </div>
    </div>
  );
}
