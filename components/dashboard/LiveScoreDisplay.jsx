
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Star, Zap, Clock } from "lucide-react";
import { motion } from "framer-motion";

function formatCountdown(seconds) {
    if (seconds <= 0) return "NOW";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s]
        .map(v => v.toString().padStart(2, '0'))
        .join(':');
}

export default function LiveScoreDisplay({ skyData }) {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const countdownMinutes = skyData?.optimal_window_countdown_minutes;
    if (countdownMinutes !== null && countdownMinutes !== undefined) {
      setCountdown(countdownMinutes * 60);
    } else {
      setCountdown(null);
    }
  }, [skyData?.optimal_window_countdown_minutes]);

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400"; 
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-emerald-500 to-green-600";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    if (score >= 40) return "from-orange-500 to-red-500";
    return "from-red-500 to-red-700";
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case "improving": return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case "declining": return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const score = skyData?.overall_score || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card border-indigo-500/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-600/5"></div>
        
        <CardContent className="p-8 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold cosmic-text">Live Sky Score</h2>
                <div className="flex items-center gap-2 mt-1">
                  {getTrendIcon(skyData?.score_trend)}
                  <span className="text-sm text-slate-400 capitalize">{skyData?.score_trend || "stable"}</span>
                </div>
              </div>
            </div>
            
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
              <Zap className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Score Dial */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-40 h-40 relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="rgba(100, 102, 241, 0.1)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${score * 2.51} 251`}
                      initial={{ strokeDasharray: "0 251" }}
                      animate={{ strokeDasharray: `${score * 2.51} 251` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444"} />
                        <stop offset="100%" stopColor={score >= 80 ? "#059669" : score >= 60 ? "#D97706" : "#DC2626"} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        className={`text-4xl font-bold ${getScoreColor(score)}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        {score}
                      </motion.div>
                      <div className="text-sm text-slate-400 font-medium">/ 100</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Countdown Timer */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2 text-indigo-300">
                  <Clock className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Optimal Window</h3>
                </div>
                {countdown !== null ? (
                  <div className="text-5xl font-bold cosmic-text tabular-nums tracking-wider">
                    {formatCountdown(countdown)}
                  </div>
                ) : (
                  <div className="text-xl text-slate-400 font-semibold mt-4">
                    No optimal window tonight
                  </div>
                )}
                <p className="text-sm text-slate-400 mt-2">
                  {countdown > 0 ? "Countdown to best conditions" : countdown === 0 ? "Optimal window is open!" : ""}
                </p>
            </div>
          </div>


          <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border border-indigo-500/20">
            <p className="text-sm text-indigo-200 text-center">
              {score >= 80 ? "🌟 Excellent conditions! Get your gear ready." : 
               score >= 60 ? "⭐ Good conditions with minor limitations. Worthwhile session." :
               score >= 40 ? "🌤️ Fair conditions. Challenging but possible for bright targets." :
               "☁️ Poor conditions. Consider processing old data or planning instead."}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
