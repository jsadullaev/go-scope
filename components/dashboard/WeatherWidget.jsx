import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  CloudRain,
  Cloud,
  Sun,
  CloudSnow
} from "lucide-react";
import { motion } from "framer-motion";

export default function WeatherWidget({ weather }) {
  const getWeatherIcon = (conditions) => {
    const condition = conditions?.toLowerCase() || "";
    if (condition.includes("clear")) return <Sun className="w-6 h-6 text-yellow-400" />;
    if (condition.includes("rain")) return <CloudRain className="w-6 h-6 text-blue-400" />;
    if (condition.includes("cloud")) return <Cloud className="w-6 h-6 text-gray-400" />;
    if (condition.includes("snow")) return <CloudSnow className="w-6 h-6 text-blue-200" />;
    return <Cloud className="w-6 h-6 text-gray-400" />;
  };

  const weatherMetrics = [
    {
      label: "Temperature",
      value: `${weather?.temperature || 0}°C`,
      icon: Thermometer,
      color: weather?.temperature > 15 ? "text-orange-400" : weather?.temperature > 0 ? "text-blue-400" : "text-cyan-300"
    },
    {
      label: "Humidity", 
      value: `${weather?.humidity || 0}%`,
      icon: Droplets,
      color: weather?.humidity > 70 ? "text-blue-500" : "text-blue-300"
    },
    {
      label: "Wind Speed",
      value: `${weather?.wind_speed || 0} km/h`,
      icon: Wind,
      color: weather?.wind_speed > 20 ? "text-red-400" : "text-green-400"
    },
    {
      label: "Visibility",
      value: `${weather?.visibility || 0} km`, 
      icon: Eye,
      color: weather?.visibility > 20 ? "text-emerald-400" : "text-yellow-400"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getWeatherIcon(weather?.conditions)}
              <span className="text-xl">Current Weather</span>
            </div>
            <div className="text-sm text-slate-400 capitalize">
              {weather?.conditions || "Loading..."}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weatherMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <span className="text-xs text-slate-400 font-medium">{metric.label}</span>
                </div>
                <div className={`text-lg font-bold ${metric.color}`}>
                  {metric.value}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-xl p-4 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Cloud Cover</span>
                <span className="text-sm font-semibold text-blue-300">{weather?.cloud_cover || 0}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${weather?.cloud_cover || 0}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl p-4 border border-emerald-500/20">
              <div className="text-sm text-slate-400 mb-2">Conditions Rating</div>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < Math.ceil((weather?.cloud_cover < 20 ? 5 : weather?.cloud_cover < 50 ? 3 : 1) || 1) 
                        ? "bg-emerald-400" 
                        : "bg-slate-600"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
