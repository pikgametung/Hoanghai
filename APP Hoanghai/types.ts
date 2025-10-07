
export enum ShipStatus {
  OPERATIONAL = 'Đang hoạt động',
  MAINTENANCE_REQUIRED = 'Cần bảo trì',
  AT_PORT = 'Tại cảng',
  IN_TRANSIT = 'Đang di chuyển',
}

export interface Ship {
  id: number;
  name: string;
  imo: string; // This field holds the MMSI for AISstream API
  trueImo: string; // This field holds the true IMO number
  type: string;
  status: ShipStatus;
  latitude: number;
  longitude: number;
  captain: string;
  builtYear: number;
  flag: string;
  speed: number; // Speed in knots
}

export interface Trip {
  id: number;
  shipId: number;
  name: string;
  departureDateTime: string;
}

export interface Voyage {
  id: number;
  shipId: number;
  tripId: number;
  origin: string;
  destination: string;
  etd: string; // Estimated Time of Departure
  eta: string; // Estimated Time of Arrival
  status: string;
  progress: number; // Percentage
}

export interface FuelLog {
  id: number;
  shipId: number;
  date: string;
  fuelConsumed: number; // in metric tons
  fuelRemaining: number; // in metric tons
}

export enum CostType {
  INCOME = 'Thu',
  EXPENSE = 'Chi',
}

export interface Cost {
  id: number;
  shipId: number;
  type: CostType;
  description: string;
  category: string;
  amount: number;
  date: string;
  tripId?: number; // Optional: link to a specific trip
}


export enum MaintenanceStatus {
  SCHEDULED = 'Đã lên lịch',
  IN_PROGRESS = 'Đang tiến hành',
  COMPLETED = 'Đã hoàn thành',
  OVERDUE = 'Quá hạn',
}

export interface MaintenanceRecord {
  id: number;
  shipId: number;
  task: string;
  dueDate: string;
  status: MaintenanceStatus;
}