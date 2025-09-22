import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Telescope, 
  Calendar, 
  MapPin, 
  Settings, 
  Camera,
  Star,
  Menu,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Telescope,
    description: "Live conditions"
  },
  {
    title: "Planner", 
    url: createPageUrl("Planner"),
    icon: Calendar,
    description: "Schedule sessions"
  },
  {
    title: "Equipment",
    url: createPageUrl("Equipment"), 
    icon: Camera,
    description: "Manage gear"
  },
  {
    title: "Locations",
    url: createPageUrl("Locations"),
    icon: MapPin,
    description: "Observation sites"
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
    description: "Alerts & preferences"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      <style>{`
        :root {
          --primary: #6366F1;
          --primary-foreground: #F8FAFC;
          --background: #0B1426;
          --card: rgba(15, 23, 42, 0.8);
          --border: rgba(100, 102, 241, 0.2);
          --muted: rgba(148, 163, 184, 0.1);
          --accent: #10B981;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #0B1426;
          color: #F8FAFC;
        }

        .glass-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(100, 102, 241, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .aurora-glow {
          background: linear-gradient(45deg, #6366F1, #10B981, #8B5CF6);
          filter: blur(60px);
          opacity: 0.1;
          animation: aurora 8s ease-in-out infinite;
        }

        @keyframes aurora {
          0%, 100% { transform: translateX(0) translateY(0); }
          33% { transform: translateX(30px) translateY(-30px); }
          66% { transform: translateX(-20px) translateY(20px); }
        }

        .cosmic-text {
          background: linear-gradient(135deg, #F8FAFC, #E2E8F0, #CBD5E1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* Aurora background effect */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="aurora-glow absolute -top-40 -right-40 w-80 h-80 rounded-full"></div>
            <div className="aurora-glow absolute -bottom-40 -left-40 w-60 h-60 rounded-full"></div>
          </div>

          <Sidebar className="glass-card border-r-0">
            <SidebarHeader className="border-b border-indigo-500/20 p-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h2 className="font-bold text-lg cosmic-text">SkyPlanner</h2>
                  <p className="text-xs text-indigo-300">Dynamic Observation Tool</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-medium text-indigo-400 uppercase tracking-wider px-2 py-3">
                  Navigation
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-2">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`group relative overflow-hidden rounded-xl px-4 py-3 transition-all duration-300 ${
                            location.pathname === item.url 
                              ? 'bg-indigo-500/20 text-indigo-300 shadow-lg' 
                              : 'hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-200'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                            <div className="flex-1">
                              <div className="font-semibold">{item.title}</div>
                              <div className="text-xs text-slate-400">{item.description}</div>
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup className="mt-8">
                <SidebarGroupLabel className="text-xs font-medium text-indigo-400 uppercase tracking-wider px-2 py-3">
                  Quick Stats
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="space-y-3 px-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Current Score</span>
                      <span className="font-bold text-emerald-400">87/100</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Next Session</span>
                      <span className="font-semibold text-indigo-300">Tonight</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Clear Sky</span>
                      <span className="font-semibold text-emerald-400">92%</span>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-indigo-500/20 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-slate-200 font-semibold text-sm">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-200 text-sm truncate">Astronomer</p>
                  <p className="text-xs text-slate-400 truncate">Clear skies ahead</p>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col relative">
            {/* Mobile header */}
            <header className="glass-card border-b border-indigo-500/20 px-4 py-3 md:hidden">
              <div className="flex items-center justify-between">
                <SidebarTrigger className="p-2 rounded-lg hover:bg-indigo-500/10 transition-colors duration-200" />
                <h1 className="text-lg font-bold cosmic-text">SkyPlanner</h1>
                <div className="w-8"></div>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
