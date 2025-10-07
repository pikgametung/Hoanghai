
import React, { useState } from 'react';
import { MaintenanceRecord, MaintenanceStatus } from '../types';
import PlusIcon from './icons/PlusIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import AddOrEditMaintenanceModal from './AddOrEditMaintenanceModal';

interface MaintenancePanelProps {
  shipId: number;
  maintenanceRecords: MaintenanceRecord[];
  onAdd: (data: Omit<MaintenanceRecord, 'id'>) => void;
  onUpdate: (id: number, data: Partial<Omit<MaintenanceRecord, 'id'>>) => void;
  onDelete: (id: number) => void;
}

const statusClasses: Record<MaintenanceStatus, string> = {
  [MaintenanceStatus.SCHEDULED]: 'bg-blue-500/20 text-blue-300',
  [MaintenanceStatus.IN_PROGRESS]: 'bg-yellow-500/20 text-yellow-300',
  [MaintenanceStatus.COMPLETED]: 'bg-green-500/20 text-green-300',
  [MaintenanceStatus.OVERDUE]: 'bg-red-500/20 text-red-300',
};


const MaintenancePanel: React.FC<MaintenancePanelProps> = ({ shipId, maintenanceRecords, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);

  const handleOpenModal = (record: MaintenanceRecord | null = null) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleSave = (data: Omit<MaintenanceRecord, 'id'> | Partial<Omit<MaintenanceRecord, 'id'>>) => {
    if (editingRecord) {
      onUpdate(editingRecord.id, data);
    } else {
      onAdd({ shipId, ...data } as Omit<MaintenanceRecord, 'id'>);
    }
    handleCloseModal();
  };
  
  const handleDelete = (id: number) => {
    if(window.confirm('Bạn có chắc chắn muốn xóa nhiệm vụ bảo trì này không?')) {
      onDelete(id);
    }
  };

  if (maintenanceRecords.length === 0) {
    return (
       <div className="text-center text-gray-400">
        <p>Không có hồ sơ bảo trì cho tàu này.</p>
        <button onClick={() => handleOpenModal()} className="mt-4 flex items-center mx-auto px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors font-semibold">
          <PlusIcon className="w-5 h-5 mr-2" />
          Thêm nhiệm vụ
        </button>
         {isModalOpen && (
          <AddOrEditMaintenanceModal
            record={editingRecord}
            onSave={handleSave}
            onClose={handleCloseModal}
          />
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Lịch trình bảo trì</h3>
        <button onClick={() => handleOpenModal()} className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 transition-colors">
            <PlusIcon className="w-5 h-5" />
            <span>Thêm nhiệm vụ</span>
        </button>
      </div>
      <div className="overflow-x-auto bg-gray-700/50 rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b border-gray-600 text-xs text-gray-400 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-3">Công việc</th>
              <th scope="col" className="px-6 py-3">Ngày hết hạn</th>
              <th scope="col" className="px-6 py-3">Trạng thái</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Hành động</span></th>
            </tr>
          </thead>
          <tbody>
            {maintenanceRecords.map((record) => (
              <tr key={record.id} className="border-b border-gray-700 hover:bg-gray-700/70 group">
                <td className="px-6 py-4 font-medium text-gray-100">{record.task}</td>
                <td className="px-6 py-4 text-gray-300">{new Date(record.dueDate).toLocaleDateString('vi-VN')}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[record.status]}`}>
                    {record.status}
                  </span>
                </td>
                 <td className="px-6 py-4 text-right">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end items-center space-x-2">
                       <button onClick={() => handleOpenModal(record)} className="p-1 rounded hover:bg-gray-600" title="Sửa"><PencilIcon className="w-4 h-4" /></button>
                       <button onClick={() => handleDelete(record.id)} className="p-1 rounded hover:bg-gray-600 text-red-400" title="Xóa"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {isModalOpen && (
        <AddOrEditMaintenanceModal
          record={editingRecord}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MaintenancePanel;
