
import React, { useState, useEffect, useRef } from 'react';
import { Ship, ShipStatus } from '../types';
import PencilSquareIcon from './icons/PencilSquareIcon';
import XMarkIcon from './icons/XMarkIcon';
import CheckIcon from './icons/CheckIcon';

// Let TypeScript know that Leaflet 'L' is available globally
declare const L: any;

interface OverviewPanelProps {
  ship: Ship;
  onUpdateShip: (shipId: number, updatedData: Partial<Omit<Ship, 'id'>>) => void;
}

const statusStyles: Record<ShipStatus, { text: string; bg: string; dot: string }> = {
  [ShipStatus.OPERATIONAL]: { text: 'text-green-300', bg: 'bg-green-500/10', dot: 'bg-green-400' },
  [ShipStatus.IN_TRANSIT]: { text: 'text-blue-300', bg: 'bg-blue-500/10', dot: 'bg-blue-400' },
  [ShipStatus.AT_PORT]: { text: 'text-yellow-300', bg: 'bg-yellow-500/10', dot: 'bg-yellow-400' },
  [ShipStatus.MAINTENANCE_REQUIRED]: { text: 'text-red-300', bg: 'bg-red-500/10', dot: 'bg-red-400' },
};

const StatCard: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg">
        <p className="text-sm text-gray-400">{label}</p>
        <div className="text-lg font-semibold text-white mt-1 truncate">{value}</div>
    </div>
);

const EditableStatCard: React.FC<{
  label: string;
  name: keyof Ship;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: 'text' | 'number' | 'select';
  options?: { value: string; label: string }[];
  step?: string;
}> = ({ label, name, value, onChange, type = 'text', options, step }) => (
  <div className="bg-gray-700/50 p-4 rounded-lg">
    <label htmlFor={name} className="text-sm text-gray-400">{label}</label>
    {type === 'select' && options ? (
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full bg-gray-900/80 text-white border-blue-500 border rounded-md px-2 py-1.5 text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        step={step}
        className="mt-1 w-full bg-gray-900/80 text-white border-blue-500 border rounded-md px-2 py-1.5 text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
    )}
  </div>
);


const OverviewPanel: React.FC<OverviewPanelProps> = ({ ship, onUpdateShip }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableShip, setEditableShip] = useState<Ship>(ship);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null); // To hold Leaflet map instance

  useEffect(() => {
    setEditableShip(ship);
    setIsEditing(false); // Exit edit mode if selected ship changes
  }, [ship]);

  useEffect(() => {
    if (isEditing) return; // Don't manipulate map in edit mode

    if (!mapContainerRef.current || typeof L === 'undefined') return;

    if (!mapRef.current) { // Initialize map
      mapRef.current = L.map(mapContainerRef.current).setView([ship.latitude, ship.longitude], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    } else { // Update existing map
      mapRef.current.setView([ship.latitude, ship.longitude], 5);
    }
    
    // Clear previous markers
    mapRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
            mapRef.current.removeLayer(layer);
        }
    });

    // Add new marker
    const marker = L.marker([ship.latitude, ship.longitude]).addTo(mapRef.current);
    marker.bindPopup(`<b>${ship.name}</b><br>Tốc độ: ${ship.speed.toFixed(1)} kn`).openPopup();
    
  }, [ship, isEditing]); // Rerun when ship changes or editing mode is toggled


  const handleSave = () => {
    onUpdateShip(ship.id, editableShip);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableShip(ship); // Revert changes
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      let parsedValue: string | number = value;
      if (e.target.type === 'number') {
        parsedValue = name === 'builtYear' ? parseInt(value) || 0 : parseFloat(value) || 0;
      }
      setEditableShip(prev => ({ ...prev, [name]: parsedValue }));
  };
  
  const statusOptions = Object.values(ShipStatus).map(s => ({value: s, label: s}));
  const { text, bg, dot } = statusStyles[ship.status];

  return (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Tổng quan về tàu</h3>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
                <PencilSquareIcon className="w-5 h-5" />
                <span>Chỉnh sửa</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button onClick={handleCancel} className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
                  <XMarkIcon className="w-5 h-5" />
                  <span>Hủy</span>
                </button>
                <button onClick={handleSave} className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 transition-colors font-semibold">
                  <CheckIcon className="w-5 h-5" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            )}
        </div>

        {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <EditableStatCard label="Tình trạng hiện tại" name="status" value={editableShip.status} onChange={handleInputChange} type="select" options={statusOptions} />
                <EditableStatCard label="Vĩ độ" name="latitude" value={editableShip.latitude} onChange={handleInputChange} type="number" step="0.0001" />
                <EditableStatCard label="Kinh độ" name="longitude" value={editableShip.longitude} onChange={handleInputChange} type="number" step="0.0001" />
                <EditableStatCard label="Loại tàu" name="type" value={editableShip.type} onChange={handleInputChange} />
                <EditableStatCard label="Thuyền trưởng" name="captain" value={editableShip.captain} onChange={handleInputChange} />
                <EditableStatCard label="Số MMSI" name="imo" value={editableShip.imo} onChange={handleInputChange} />
                <EditableStatCard label="Số IMO" name="trueImo" value={editableShip.trueImo} onChange={handleInputChange} />
                <EditableStatCard label="Cờ" name="flag" value={editableShip.flag} onChange={handleInputChange} />
                <EditableStatCard label="Năm đóng" name="builtYear" value={editableShip.builtYear} onChange={handleInputChange} type="number"/>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <p className="text-sm text-gray-400 mb-2">Vị trí hiện tại</p>
                <div ref={mapContainerRef} className="h-[300px] w-full bg-gray-700 rounded-lg z-0"></div>
              </div>
              <div className="space-y-4 md:col-span-1">
                 <StatCard label="Tình trạng" value={
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${bg} ${text}`}>
                        <span className={`w-2 h-2 mr-2 rounded-full ${dot}`}></span>
                        {ship.status}
                    </div>
                } />
                <StatCard label="Tốc độ hiện tại" value={`${ship.speed.toFixed(1)} hải lý/giờ`} />
                <StatCard label="Thuyền trưởng" value={ship.captain} />
              </div>
              <StatCard label="Loại tàu" value={ship.type} />
              <StatCard label="Số MMSI" value={ship.imo} />
              <StatCard label="Số IMO" value={ship.trueImo} />
              <StatCard label="Cờ" value={ship.flag} />
              <StatCard label="Năm đóng" value={ship.builtYear} />
            </div>
        )}
    </div>
  );
};

export default OverviewPanel;