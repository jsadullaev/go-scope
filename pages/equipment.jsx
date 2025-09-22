
import React, { useState, useEffect } from "react";
import { Equipment } from "@/entities/Equipment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  Telescope, 
  Settings, 
  Plus, 
  Filter,
  Wrench,
  Copy,
  Star,
  Search
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

import EquipmentForm from "../components/equipment/EquipmentForm";
import EquipmentCard from "../components/equipment/EquipmentCard";
import QuickProfileSwitcher from "../components/equipment/QuickProfileSwitcher";

const EQUIPMENT_TYPES = [
  { key: "camera_body", label: "Camera Bodies", icon: Camera, color: "bg-indigo-500" },
  { key: "lens", label: "Lenses", icon: Telescope, color: "bg-purple-500" },
  { key: "telescope", label: "Telescopes", icon: Telescope, color: "bg-emerald-500" },
  { key: "mount", label: "Mounts", icon: Settings, color: "bg-orange-500" },
  { key: "filter", label: "Filters", icon: Filter, color: "bg-cyan-500" },
  { key: "accessory", label: "Accessories", icon: Wrench, color: "bg-pink-500" }
];

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadEquipment();
  }, []);

  useEffect(() => {
    filterEquipment();
  }, [equipment, activeTab, searchQuery]);

  const loadEquipment = async () => {
    const data = await Equipment.list("-created_date");
    setEquipment(data);
  };

  const filterEquipment = () => {
    let filtered = equipment;
    
    if (activeTab !== "all") {
      filtered = filtered.filter(item => item.profile_type === activeTab);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.manufacturer?.toLowerCase().includes(query) ||
        item.model?.toLowerCase().includes(query)
      );
    }
    
    setFilteredEquipment(filtered);
  };

  const handleSave = async (equipmentData) => {
    if (editingItem) {
      await Equipment.update(editingItem.id, equipmentData);
    } else {
      await Equipment.create(equipmentData);
    }
    setShowForm(false);
    setEditingItem(null);
    loadEquipment();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleClone = async (item) => {
    const clonedData = {
      ...item,
      name: `${item.name} (Copy)`,
      is_primary: false
    };
    delete clonedData.id;
    delete clonedData.created_date;
    delete clonedData.updated_date;
    delete clonedData.created_by;
    
    await Equipment.create(clonedData);
    loadEquipment();
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Delete ${item.name}?`)) {
      await Equipment.delete(item.id);
      loadEquipment();
    }
  };

  const handleSetPrimary = async (item) => {
    // First, unset all primary flags for this equipment type
    const sameTypeItems = equipment.filter(eq => eq.profile_type === item.profile_type);
    for (const sameItem of sameTypeItems) {
      if (sameItem.is_primary) {
        await Equipment.update(sameItem.id, { ...sameItem, is_primary: false });
      }
    }
    
    // Set this item as primary
    await Equipment.update(item.id, { ...item, is_primary: true });
    loadEquipment();
  };

  const getEquipmentStats = () => {
    const stats = {};
    EQUIPMENT_TYPES.forEach(type => {
      stats[type.key] = equipment.filter(item => item.profile_type === type.key).length;
    });
    stats.total = equipment.length;
    stats.active = equipment.filter(item => item.is_active).length;
    return stats;
  };

  const stats = getEquipmentStats();

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
                Equipment Profiles
              </h1>
              <p className="text-slate-400">Manage your astrophotography gear for optimal performance</p>
            </div>
            
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
            </Button>
          </div>
        </motion.div>

        {/* Quick Profile Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <QuickProfileSwitcher 
            equipment={equipment.filter(eq => eq.is_primary)} 
            onProfileChange={loadEquipment}
          />
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <EquipmentForm
              equipment={editingItem}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            />
          </motion.div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-xl font-bold text-slate-200">{stats.total}</div>
                  <div className="text-sm text-slate-400">Total Items</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xl font-bold text-slate-200">{stats.active}</div>
                  <div className="text-sm text-slate-400">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Telescope className="w-5 h-5 text-purple-400" />
