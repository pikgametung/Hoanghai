import React, { useState } from 'react';
import { Ship, ShipStatus } from '../types';
import ShipIcon from './icons/ShipIcon';
import PlusIcon from './icons/PlusIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';

interface FleetListProps {
  ships: Ship[];
  selectedShipId: number | null;
  onSelectShip: (id: number) => void;
  onUpdateShip: (shipId: number, updatedData: Partial<Omit<Ship, 'id'>>) => void;
  onDeleteShip: (shipId: number) => void;
  onAddShipClick: () => void;
}

const statusColors: Record<ShipStatus, string> = {
  [ShipStatus.OPERATIONAL]: 'bg-green-500',
  [ShipStatus.IN_TRANSIT]: 'bg-blue-500',
  [ShipStatus.AT_PORT]: 'bg-yellow-500',
  [ShipStatus.MAINTENANCE_REQUIRED]: 'bg-red-500',
};

const FleetList: React.FC<FleetListProps> = ({ ships, selectedShipId, onSelectShip, onUpdateShip, onDeleteShip, onAddShipClick }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleStartEdit = (ship: Ship) => {
    setEditingId(ship.id);
    setEditingName(ship.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onUpdateShip(editingId, { name: editingName.trim() });
    }
    handleCancelEdit();
  };

  const handleDelete = (shipId: number, shipName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tàu "${shipName}" không? Hành động này không thể hoàn tác.`)) {
      onDeleteShip(shipId);
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-lg font-semibold text-gray-300">Danh sách đội tàu</h2>
        <button 
            onClick={onAddShipClick}
            className="p-2 rounded-full bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white transition-colors duration-200"
            title="Thêm tàu mới"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
      <ul className="space-y-2">
        {ships.map((ship) => (
          <li key={ship.id} 
            className={`group rounded-lg transition-colors duration-200 ${
              selectedShipId === ship.id
                ? 'bg-blue-600/30 text-white shadow-lg'
                : 'bg-gray-700/50 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center w-full text-left p-3 space-x-3">
              <ShipIcon className="w-6 h-6 text-gray-400 flex-shrink-0" />

              <div className="flex-1 min-w-0" onClick={() => editingId !== ship.id && onSelectShip(ship.id)} style={{ cursor: editingId !== ship.id ? 'pointer' : 'default' }}>
                {editingId === ship.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-gray-900/80 text-white border-blue-500 border rounded-md px-1 py-0 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    autoFocus
                  />
                ) : (
                  <>
                    <p className="font-semibold truncate">{ship.name}</p>
                    <p className="text-xs text-gray-400 truncate">{ship.type}</p>
                  </>
                )}
              </div>
              
              <div className="flex items-center flex-shrink-0 space-x-1">
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {editingId === ship.id ? null : (
                    <button onClick={(e) => { e.stopPropagation(); handleStartEdit(ship); }} className="p-1 rounded hover:bg-gray-600" title="Sửa tên tàu">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(ship.id, ship.name); }} className="p-1 rounded hover:bg-gray-600 text-red-400 hover:text-red-300" title="Xóa tàu">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <span 
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${statusColors[ship.status]}`}
                  title={ship.status}
                ></span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FleetList;
