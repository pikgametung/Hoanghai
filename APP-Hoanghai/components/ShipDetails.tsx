
import React, { useState } from 'react';
import { Ship, Trip, Voyage, FuelLog, Cost, MaintenanceRecord } from '../types';
import OverviewPanel from './OverviewPanel';
import VoyagePanel from './VoyagePanel';
import FuelPanel from './FuelPanel';
import CostPanel from './CostPanel';
import MaintenancePanel from './MaintenancePanel';
import ClipboardDocumentListIcon from './icons/ClipboardDocumentListIcon';
import MapPinIcon from './icons/MapPinIcon';
import GaugeIcon from './icons/GaugeIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import WrenchScrewdriverIcon from './icons/WrenchScrewdriverIcon';

interface ShipDetailsProps {
  ship: Ship;
  trips: Trip[];
  voyages: Voyage[];
  fuelLogs: FuelLog[];
  costs: Cost[];
  maintenanceRecords: MaintenanceRecord[];
  onUpdateShip: (shipId: number, updatedData: Partial<Omit<Ship, 'id'>>) => void;
  // Trip props
  onAddTrip: (data: Omit<Trip, 'id'>) => void;
  onUpdateTrip: (id: number, data: Partial<Omit<Trip, 'id'>>) => void;
  onDeleteTrip: (id: number) => void;
  // Voyage props
  onAddVoyage: (data: Omit<Voyage, 'id'>) => void;
  onUpdateVoyage: (id: number, data: Partial<Omit<Voyage, 'id'>>) => void;
  onDeleteVoyage: (id: number) => void;
  // FuelLog props
  onAddFuelLog: (data: Omit<FuelLog, 'id'>) => void;
  onUpdateFuelLog: (id: number, data: Partial<Omit<FuelLog, 'id'>>) => void;
  onDeleteFuelLog: (id: number) => void;
  // Cost props
  onAddCost: (data: Omit<Cost, 'id'>) => void;
  onUpdateCost: (id: number, data: Partial<Omit<Cost, 'id'>>) => void;
  onDeleteCost: (id: number) => void;
  costCategories: string[];
  onAddCostCategory: (newCategory: string) => void;
  onUpdateCostCategory: (oldCategory: string, newCategory: string) => void;
  onDeleteCostCategory: (categoryToDelete: string) => void;
  // Maintenance props
  onAddMaintenanceRecord: (data: Omit<MaintenanceRecord, 'id'>) => void;
  onUpdateMaintenanceRecord: (id: number, data: Partial<Omit<MaintenanceRecord, 'id'>>) => void;
  onDeleteMaintenanceRecord: (id: number) => void;
}

type Tab = 'overview' | 'voyage' | 'fuel' | 'costs' | 'maintenance';

const ShipDetails: React.FC<ShipDetailsProps> = (props) => {
  const { ship, trips, voyages, fuelLogs, costs, maintenanceRecords, onUpdateShip } = props;
  const [activeTab, setActiveTab] = useState<Tab>('costs');

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: ClipboardDocumentListIcon },
    { id: 'voyage', label: 'Hành trình', icon: MapPinIcon },
    { id: 'fuel', label: 'Nhiên liệu', icon: GaugeIcon },
    { id: 'costs', label: 'Chi phí', icon: CurrencyDollarIcon },
    { id: 'maintenance', label: 'Bảo trì', icon: WrenchScrewdriverIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPanel ship={ship} onUpdateShip={onUpdateShip} />;
      case 'voyage':
        return <VoyagePanel 
                  shipId={ship.id}
                  trips={trips}
                  voyages={voyages} 
                  onAddTrip={props.onAddTrip}
                  onUpdateTrip={props.onUpdateTrip}
                  onDeleteTrip={props.onDeleteTrip}
                  onAddVoyage={props.onAddVoyage}
                  onUpdateVoyage={props.onUpdateVoyage}
                  onDeleteVoyage={props.onDeleteVoyage}
                />;
      case 'fuel':
        return <FuelPanel
                  shipId={ship.id}
                  fuelLogs={fuelLogs}
                  onAdd={props.onAddFuelLog}
                  onUpdate={props.onUpdateFuelLog}
                  onDelete={props.onDeleteFuelLog}
                />;
      case 'costs':
        return <CostPanel 
                  shipId={ship.id}
                  costs={costs} 
                  trips={trips}
                  onAdd={props.onAddCost}
                  onUpdate={props.onUpdateCost}
                  onDelete={props.onDeleteCost}
                  costCategories={props.costCategories}
                  onAddCategory={props.onAddCostCategory}
                  onUpdateCategory={props.onUpdateCostCategory}
                  onDeleteCategory={props.onDeleteCostCategory}
                />;
      case 'maintenance':
        return <MaintenancePanel
                  shipId={ship.id}
                  maintenanceRecords={maintenanceRecords} 
                  onAdd={props.onAddMaintenanceRecord}
                  onUpdate={props.onUpdateMaintenanceRecord}
                  onDelete={props.onDeleteMaintenanceRecord}
                />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-xl h-full flex flex-col">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{ship.name}</h2>
        <p className="text-md text-gray-400">MMSI: {ship.imo} / IMO: {ship.trueImo}</p>
      </div>
      <div className="border-b border-gray-700">
        <nav className="flex space-x-2 overflow-x-auto p-2 scrollbar-hide" aria-label="Tabs">
          {tabs.map((tab) => {
             const Icon = tab.icon;
             return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex-shrink-0 flex items-center space-x-2 whitespace-nowrap py-2 px-4 rounded-full font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 hidden sm:inline-block" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      </div>
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default ShipDetails;
