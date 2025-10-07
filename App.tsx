import React, { useState, useMemo, useEffect } from 'react';
import { useFleetData } from './hooks/useFleetData';
import Header from './components/Header';
import FleetList from './components/FleetList';
import ShipDetails from './components/ShipDetails';
import AddShipModal from './components/AddShipModal';
import { Ship } from './types';
import ShipIcon from './components/icons/ShipIcon';

const App: React.FC = () => {
  const { 
    ships, trips, voyages, fuelLogs, costs, maintenance, costCategories, loading, 
    addShip, updateShip, deleteShip,
    addTrip, updateTrip, deleteTrip,
    addVoyage, updateVoyage, deleteVoyage,
    addFuelLog, updateFuelLog, deleteFuelLog,
    addCost, updateCost, deleteCost,
    addMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord,
    addCostCategory, updateCostCategory, deleteCostCategory
  } = useFleetData();
  const [selectedShipId, setSelectedShipId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // If there's no selection but there are ships, select the first one.
    if (!selectedShipId && ships.length > 0) {
      setSelectedShipId(ships[0].id);
    }
    // If the selected ship no longer exists (e.g., deleted), select the first one.
    if (selectedShipId && !ships.find(s => s.id === selectedShipId)) {
      setSelectedShipId(ships.length > 0 ? ships[0].id : null);
    }
    // If there are no ships, clear selection.
    if (ships.length === 0) {
      setSelectedShipId(null);
    }
  }, [ships, selectedShipId]);

  const selectedShip = useMemo(() => {
    return ships.find(ship => ship.id === selectedShipId) || null;
  }, [ships, selectedShipId]);
  
  const handleAddShip = (newShipData: Omit<Ship, 'id' | 'status' | 'latitude' | 'longitude' | 'captain' | 'builtYear' | 'flag' | 'speed'>) => {
    addShip(newShipData);
    setIsAddModalOpen(false);
  };
  
  const handleSelectShip = (id: number) => {
    setSelectedShipId(id);
    setIsSidebarOpen(false); // Close sidebar on selection
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <svg className="animate-spin h-8 w-8 mr-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Đang tải dữ liệu đội tàu...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200 font-sans">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-30 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            ></div>
          )}
          <aside className={`fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out md:relative md:w-1/4 md:translate-x-0 xl:w-1/5 bg-gray-800 p-4 overflow-y-auto border-r border-gray-700 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <FleetList 
              ships={ships}
              selectedShipId={selectedShipId}
              onSelectShip={handleSelectShip}
              onUpdateShip={updateShip}
              onDeleteShip={deleteShip}
              onAddShipClick={() => setIsAddModalOpen(true)}
            />
          </aside>
          <main className="flex-1 p-6 overflow-y-auto">
            {selectedShip ? (
              <ShipDetails 
                ship={selectedShip}
                trips={trips.filter(t => t.shipId === selectedShip.id)}
                voyages={voyages.filter(v => v.shipId === selectedShip.id)}
                fuelLogs={fuelLogs.filter(f => f.shipId === selectedShip.id)}
                costs={costs.filter(c => c.shipId === selectedShip.id)}
                maintenanceRecords={maintenance.filter(m => m.shipId === selectedShip.id)}
                onUpdateShip={updateShip}
                onAddTrip={addTrip}
                onUpdateTrip={updateTrip}
                onDeleteTrip={deleteTrip}
                onAddVoyage={addVoyage}
                onUpdateVoyage={updateVoyage}
                onDeleteVoyage={deleteVoyage}
                onAddFuelLog={addFuelLog}
                onUpdateFuelLog={updateFuelLog}
                onDeleteFuelLog={deleteFuelLog}
                onAddCost={addCost}
                onUpdateCost={updateCost}
                onDeleteCost={deleteCost}
                costCategories={costCategories}
                onAddCostCategory={addCostCategory}
                onUpdateCostCategory={updateCostCategory}
                onDeleteCostCategory={deleteCostCategory}
                onAddMaintenanceRecord={addMaintenanceRecord}
                onUpdateMaintenanceRecord={updateMaintenanceRecord}
                onDeleteMaintenanceRecord={deleteMaintenanceRecord}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShipIcon className="w-24 h-24 mb-4" />
                <h2 className="text-2xl font-semibold">Chọn một tàu để xem chi tiết</h2>
                <p>Thêm tàu mới hoặc chọn một tàu từ danh sách đội tàu.</p>
              </div>
            )}
          </main>
        </div>
      </div>
      {isAddModalOpen && (
        <AddShipModal 
          onAddShip={handleAddShip} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      )}
    </>
  );
};

export default App;