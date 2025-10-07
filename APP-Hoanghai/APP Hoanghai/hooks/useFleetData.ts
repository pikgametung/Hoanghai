import { useState, useEffect, useRef } from 'react';
import { Ship, ShipStatus, Trip, Voyage, FuelLog, Cost, MaintenanceRecord, MaintenanceStatus, CostType } from '../types';

const AISSTREAM_API_KEY = '8df44d8a7053726bbe3816e4fb5a3fd43c97ae4d';

const shipsData: Ship[] = [
  { id: 1, name: 'HOANG HAI STAR', imo: '574412000', trueImo: '9524360', type: 'Tàu hàng tổng hợp', status: ShipStatus.AT_PORT, latitude: 20.85, longitude: 106.78, captain: 'Nguyễn Văn An', builtYear: 2009, flag: 'Việt Nam', speed: 0 },
  { id: 2, name: 'HOÀNG HẢI ACE', imo: '574372000', trueImo: '9400710', type: 'Tàu hàng tổng hợp', status: ShipStatus.AT_PORT, latitude: 20.85, longitude: 106.78, captain: 'Trần Bình', builtYear: 2007, flag: 'Việt Nam', speed: 0 },
  { id: 3, name: 'HOÀNG HẢI 268', imo: '574570000', trueImo: '9026942', type: 'Tàu hàng tổng hợp', status: ShipStatus.AT_PORT, latitude: 20.85, longitude: 106.78, captain: 'Lê Cường', builtYear: 1991, flag: 'Việt Nam', speed: 0 },
  { id: 4, name: 'HOÀNG HẢI 68', imo: '574000310', trueImo: '9571777', type: 'Tàu hàng tổng hợp', status: ShipStatus.AT_PORT, latitude: 20.85, longitude: 106.78, captain: 'Phạm Dũng', builtYear: 2010, flag: 'Việt Nam', speed: 0 },
];

const tripsData: Trip[] = [
  { id: 1, shipId: 1, name: "Chuyến hàng Hải Phòng - Singapore", departureDateTime: "2024-07-20T08:00:00" },
  { id: 2, shipId: 2, name: "Chuyến hàng Vũng Tàu - Bangkok", departureDateTime: "2024-07-18T10:00:00" },
];

const voyagesData: Voyage[] = [
  { id: 1, shipId: 1, tripId: 1, origin: 'Hải Phòng, Việt Nam', destination: 'Singapore (Hành trình đến)', etd: '2024-07-20', eta: '2024-07-25', status: 'Đúng lịch trình', progress: 10 },
  { id: 2, shipId: 1, tripId: 1, origin: 'Singapore', destination: 'Hải Phòng, Việt Nam (Hành trình về)', etd: '2024-07-28', eta: '2024-08-02', status: 'Đã lên lịch', progress: 0 },
  { id: 3, shipId: 2, tripId: 2, origin: 'Vũng Tàu, Việt Nam', destination: 'Bangkok, Thái Lan', etd: '2024-07-18', eta: '2024-07-22', status: 'Đúng lịch trình', progress: 40 },
];

const fuelLogsData: FuelLog[] = [];

const initialCostCategories: string[] = [
    'Nhiên liệu',
    'Lương thủy thủ đoàn',
    'Bảo trì & Sửa chữa',
    'Phí cảng',
    'Vật tư & Nhu yếu phẩm',
    'Bảo hiểm',
    'Doanh thu chuyến hàng',
    'Phí dịch vụ',
];

const costsData: Cost[] = [
    {id: 1, shipId: 1, tripId: 1, type: CostType.EXPENSE, description: "Nạp nhiên liệu trước chuyến đi", category: "Nhiên liệu", amount: 750000000, date: "2024-07-19"},
    {id: 2, shipId: 1, tripId: 1, type: CostType.INCOME, description: "Thanh toán cước vận chuyển", category: "Doanh thu chuyến hàng", amount: 1200000000, date: "2024-07-20"},
    {id: 3, shipId: 2, tripId: 2, type: CostType.EXPENSE, description: "Phí hoa tiêu tại Vũng Tàu", category: "Phí cảng", amount: 25000000, date: "2024-07-18"},
    {id: 4, shipId: 1, type: CostType.EXPENSE, description: "Bảo hiểm thân tàu hàng năm", category: "Bảo hiểm", amount: 150000000, date: "2024-01-15"},
];


const maintenanceData: MaintenanceRecord[] = [
    {id: 1, shipId: 1, task: "Kiểm tra động cơ chính", dueDate: "2024-08-01", status: MaintenanceStatus.SCHEDULED},
    {id: 2, shipId: 2, task: "Sơn lại vỏ tàu", dueDate: "2024-07-15", status: MaintenanceStatus.IN_PROGRESS},
];

// Helper to get item from localStorage or use a fallback
const getFromStorage = <T>(key: string, fallback: T): T => {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
    }
    return fallback;
};

// Helper to save item to localStorage
const saveToStorage = <T>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};

export const useFleetData = () => {
  const [ships, setShips] = useState<Ship[]>(() => getFromStorage('fleet_ships', shipsData));
  const [trips, setTrips] = useState<Trip[]>(() => getFromStorage('fleet_trips', tripsData));
  const [voyages, setVoyages] = useState<Voyage[]>(() => getFromStorage('fleet_voyages', voyagesData));
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(() => getFromStorage('fleet_fuel_logs', fuelLogsData));
  const [costs, setCosts] = useState<Cost[]>(() => getFromStorage('fleet_costs', costsData));
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(() => getFromStorage('fleet_maintenance', maintenanceData));
  const [costCategories, setCostCategories] = useState<string[]>(() => getFromStorage('fleet_cost_categories', initialCostCategories));
  const [loading, setLoading] = useState(false); // No longer need loading simulation
  const wsRef = useRef<WebSocket | null>(null);

  // Effect for real-time AIS data
  useEffect(() => {
    const connect = () => {
      wsRef.current = new WebSocket('wss://stream.aisstream.io/v0/stream');
      const ws = wsRef.current;

      ws.onopen = () => {
          console.log('Connected to AISstream for real-time ship tracking.');
          const initialShips = getFromStorage('fleet_ships', shipsData);
          const mmsis = initialShips.map(ship => ship.imo);

          const subscriptionMessage = {
              APIkey: AISSTREAM_API_KEY,
              FiltersShipMMSI: mmsis,
          };
          
          try {
              ws.send(JSON.stringify(subscriptionMessage));
          } catch (error) {
              console.error("Failed to send initial subscription message:", error);
          }
      };

      ws.onmessage = (event) => {
          try {
              const data = JSON.parse(event.data);
              
              if (data.MessageType === 'PositionReport') {
                  const mmsi = String(data.MetaData?.MMSI || data.Message?.PositionReport?.UserID);
                  const report = data.Message.PositionReport;
                  const newLat = report.Latitude;
                  const newLon = report.Longitude;
                  const speed = report.Sog || 0; // Speed over ground in knots

                  if (mmsi && typeof newLat === 'number' && typeof newLon === 'number') {
                       setShips(prevShips => 
                          prevShips.map(ship => 
                              ship.imo === mmsi 
                              ? { 
                                  ...ship, 
                                  latitude: newLat, 
                                  longitude: newLon,
                                  speed: speed,
                                  status: speed > 0.1 ? ShipStatus.IN_TRANSIT : ShipStatus.AT_PORT,
                              }
                              : ship
                          )
                      );
                  }
              }
          } catch (error) {
              console.error("Error processing AIS message:", error);
          }
      };

      ws.onerror = (error) => {
          console.error('AISstream WebSocket Error. See the following onclose event for details.');
      };

      ws.onclose = (event) => {
          console.error(`AISstream connection closed. Code: ${event.code}, Reason: "${event.reason || 'No reason provided'}".`);
          console.log("Reconnecting in 5 seconds...");
          wsRef.current = null;
          setTimeout(connect, 5000); // Attempt to reconnect after 5 seconds
      };
    };
    
    connect();

    return () => {
      if (wsRef.current) {
        // Prevent reconnection logic from firing on component unmount
        wsRef.current.onclose = null; 
        wsRef.current.close();
      }
    };
  }, []); // Mảng phụ thuộc trống có nghĩa là hiệu ứng này chỉ chạy một lần khi gắn kết.


  // Save data to localStorage whenever it changes
  useEffect(() => { saveToStorage('fleet_ships', ships); }, [ships]);
  useEffect(() => { saveToStorage('fleet_trips', trips); }, [trips]);
  useEffect(() => { saveToStorage('fleet_voyages', voyages); }, [voyages]);
  useEffect(() => { saveToStorage('fleet_fuel_logs', fuelLogs); }, [fuelLogs]);
  useEffect(() => { saveToStorage('fleet_costs', costs); }, [costs]);
  useEffect(() => { saveToStorage('fleet_maintenance', maintenance); }, [maintenance]);
  useEffect(() => { saveToStorage('fleet_cost_categories', costCategories); }, [costCategories]);


  const addShip = (newShipData: Omit<Ship, 'id' | 'status' | 'latitude' | 'longitude' | 'captain' | 'builtYear' | 'flag' | 'speed'>) => {
    let newShip: Ship | null = null;
    setShips(prevShips => {
      const newId = Math.max(0, ...prevShips.map(s => s.id)) + 1;
      newShip = {
        id: newId,
        status: ShipStatus.AT_PORT,
        latitude: 1.264, // Default to Singapore
        longitude: 103.839,
        captain: 'Chưa chỉ định',
        builtYear: new Date().getFullYear(),
        flag: 'N/A',
        speed: 0,
        ...newShipData,
      };
      return [...prevShips, newShip];
    });

    // Subscribe to the new ship's real-time updates
    if (newShip && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const subscriptionMessage = {
          APIkey: AISSTREAM_API_KEY,
          FiltersShipMMSI: [newShip.imo], // 'imo' holds the MMSI
      };
      try {
          wsRef.current.send(JSON.stringify(subscriptionMessage));
          console.log(`Subscribed to real-time updates for new ship: ${newShip.name}`);
      } catch (error) {
          console.error("Failed to send subscription for new ship:", error);
      }
    }
  };

  const updateShip = (shipId: number, updatedData: Partial<Omit<Ship, 'id'>>) => {
    setShips(prevShips =>
      prevShips.map(ship =>
        ship.id === shipId ? { ...ship, ...updatedData } : ship
      )
    );
  };

  const deleteShip = (shipId: number) => {
    // Note: AISstream API doesn't support unsubscribing. 
    // The connection would need to be reset to remove a filter.
    // For simplicity, we will just remove it from the UI.
    setShips(prevShips => prevShips.filter(ship => ship.id !== shipId));
    setTrips(prev => prev.filter(t => t.shipId !== shipId));
    setVoyages(prev => prev.filter(v => v.shipId !== shipId));
    setFuelLogs(prev => prev.filter(f => f.shipId !== shipId));
    setCosts(prev => prev.filter(c => c.shipId !== shipId));
    setMaintenance(prev => prev.filter(m => m.shipId !== shipId));
  };
  
  // Trip CRUD
  const addTrip = (newTripData: Omit<Trip, 'id'>) => {
    setTrips(prev => {
        const newId = Math.max(0, ...prev.map(t => t.id)) + 1;
        return [...prev, { id: newId, ...newTripData }];
    });
  };

  const updateTrip = (tripId: number, updatedData: Partial<Omit<Trip, 'id'>>) => {
    setTrips(prev => prev.map(t => (t.id === tripId ? { ...t, ...updatedData } : t)));
  };

  const deleteTrip = (tripId: number) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
    setVoyages(prev => prev.filter(v => v.tripId !== tripId)); // Cascade delete voyages
  };


  // Voyage CRUD
  const addVoyage = (newVoyageData: Omit<Voyage, 'id'>) => {
    setVoyages(prev => {
      const newId = Math.max(0, ...prev.map(v => v.id)) + 1;
      return [...prev, { id: newId, ...newVoyageData }];
    });
  };

  const updateVoyage = (voyageId: number, updatedData: Partial<Omit<Voyage, 'id'>>) => {
    setVoyages(prev => prev.map(v => v.id === voyageId ? { ...v, ...updatedData } : v));
  };

  const deleteVoyage = (voyageId: number) => {
    setVoyages(prev => prev.filter(v => v.id !== voyageId));
  };

  // FuelLog CRUD
  const addFuelLog = (newFuelLogData: Omit<FuelLog, 'id'>) => {
    setFuelLogs(prev => {
      const newId = Math.max(0, ...prev.map(f => f.id)) + 1;
      return [...prev, { id: newId, ...newFuelLogData }].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  };

  const updateFuelLog = (logId: number, updatedData: Partial<Omit<FuelLog, 'id'>>) => {
    setFuelLogs(prev => prev.map(f => f.id === logId ? { ...f, ...updatedData } : f));
  };

  const deleteFuelLog = (logId: number) => {
    setFuelLogs(prev => prev.filter(f => f.id !== logId));
  };

  // Cost CRUD
  const addCost = (newCostData: Omit<Cost, 'id'>) => {
    setCosts(prev => {
      const newId = Math.max(0, ...prev.map(c => c.id)) + 1;
      return [...prev, { id: newId, ...newCostData }];
    });
  };

  const updateCost = (costId: number, updatedData: Partial<Omit<Cost, 'id'>>) => {
    setCosts(prev => prev.map(c => c.id === costId ? { ...c, ...updatedData } : c));
  };

  const deleteCost = (costId: number) => {
    setCosts(prev => prev.filter(c => c.id !== costId));
  };

  // Maintenance CRUD
  const addMaintenanceRecord = (newRecordData: Omit<MaintenanceRecord, 'id'>) => {
    setMaintenance(prev => {
      const newId = Math.max(0, ...prev.map(m => m.id)) + 1;
      return [...prev, { id: newId, ...newRecordData }];
    });
  };

  const updateMaintenanceRecord = (recordId: number, updatedData: Partial<Omit<MaintenanceRecord, 'id'>>) => {
    setMaintenance(prev => prev.map(m => m.id === recordId ? { ...m, ...updatedData } : m));
  };

  const deleteMaintenanceRecord = (recordId: number) => {
    setMaintenance(prev => prev.filter(m => m.id !== recordId));
  };

  // Cost Category Management
  const addCostCategory = (newCategory: string) => {
      if (!newCategory.trim()) return;
      if (costCategories.some(c => c.toLowerCase() === newCategory.trim().toLowerCase())) {
          alert(`Danh mục "${newCategory}" đã tồn tại.`);
          return;
      }
      setCostCategories(prev => [...prev, newCategory.trim()]);
  };

  const updateCostCategory = (oldCategory: string, newCategory: string) => {
      if (!newCategory.trim() || oldCategory === newCategory) return;
      if (costCategories.some(c => c.toLowerCase() === newCategory.trim().toLowerCase() && c.toLowerCase() !== oldCategory.toLowerCase())) {
          alert(`Danh mục "${newCategory}" đã tồn tại.`);
          return;
      }
      
      setCostCategories(prev => prev.map(cat => (cat === oldCategory ? newCategory.trim() : cat)));
      
      setCosts(prevCosts => prevCosts.map(cost => 
          cost.category === oldCategory ? { ...cost, category: newCategory.trim() } : cost
      ));
  };

  const deleteCostCategory = (categoryToDelete: string) => {
      const isCategoryInUse = costs.some(cost => cost.category === categoryToDelete);
      if (isCategoryInUse) {
          alert(`Không thể xóa danh mục "${categoryToDelete}" vì nó đang được sử dụng trong ít nhất một bản ghi chi phí.`);
          return;
      }
      setCostCategories(prev => prev.filter(cat => cat !== categoryToDelete));
  };


  return { 
      ships, trips, voyages, fuelLogs, costs, maintenance, costCategories, loading, 
      addShip, updateShip, deleteShip,
      addTrip, updateTrip, deleteTrip,
      addVoyage, updateVoyage, deleteVoyage,
      addFuelLog, updateFuelLog, deleteFuelLog,
      addCost, updateCost, deleteCost,
      addMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord,
      addCostCategory, updateCostCategory, deleteCostCategory
    };
};