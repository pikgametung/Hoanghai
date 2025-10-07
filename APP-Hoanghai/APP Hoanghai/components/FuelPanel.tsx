
import React, { useState } from 'react';
import { FuelLog } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PlusIcon from './icons/PlusIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import AddOrEditFuelLogModal from './AddOrEditFuelLogModal';

interface FuelPanelProps {
  shipId: number;
  fuelLogs: FuelLog[];
  onAdd: (data: Omit<FuelLog, 'id'>) => void;
  onUpdate: (id: number, data: Partial<Omit<FuelLog, 'id'>>) => void;
  onDelete: (id: number) => void;
}

const FuelPanel: React.FC<FuelPanelProps> = ({ shipId, fuelLogs, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<FuelLog | null>(null);

  const handleOpenModal = (log: FuelLog | null = null) => {
    setEditingLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLog(null);
  };
  
  const handleSave = (data: Omit<FuelLog, 'id'> | Partial<Omit<FuelLog, 'id'>>) => {
    if (editingLog) {
      onUpdate(editingLog.id, data);
    } else {
      onAdd({ shipId, ...data } as Omit<FuelLog, 'id'>);
    }
    handleCloseModal();
  };
  
  const handleDelete = (id: number) => {
    if(window.confirm('Bạn có chắc chắn muốn xóa bản ghi nhiên liệu này không?')) {
      onDelete(id);
    }
  };

  const formattedData = fuelLogs.map(log => ({
    ...log,
    date: new Date(log.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="animate-fade-in">
      <div className="h-[400px]">
        <h3 className="text-xl font-semibold mb-6 text-white">Mức tiêu thụ nhiên liệu (Tấn)</h3>
        {fuelLogs.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="date" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" />
              <Tooltip 
                 contentStyle={{ 
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    borderColor: '#4A5568',
                    color: '#E5E7EB'
                 }} 
              />
              <Legend wrapperStyle={{color: '#E5E7EB'}}/>
              <Line type="monotone" dataKey="fuelConsumed" name="Tiêu thụ" stroke="#38BDF8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="fuelRemaining" name="Còn lại" stroke="#34D399" />
            </LineChart>
          </ResponsiveContainer>
        ) : <p className="text-gray-400 text-center pt-16">Không có dữ liệu nhật ký nhiên liệu cho tàu này.</p>}
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white">Nhật ký nhiên liệu</h4>
          <button onClick={() => handleOpenModal()} className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 transition-colors">
            <PlusIcon className="w-5 h-5" />
            <span>Thêm bản ghi</span>
          </button>
        </div>
        <div className="overflow-x-auto bg-gray-700/50 rounded-lg max-h-60 overflow-y-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="border-b border-gray-600 text-xs text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-700/50">
              <tr>
                <th scope="col" className="px-6 py-3">Ngày</th>
                <th scope="col" className="px-6 py-3">Đã tiêu thụ (tấn)</th>
                <th scope="col" className="px-6 py-3">Còn lại (tấn)</th>
                <th scope="col" className="px-6 py-3"><span className="sr-only">Hành động</span></th>
              </tr>
            </thead>
            <tbody>
              {fuelLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-700 hover:bg-gray-700/70 group">
                  <td className="px-6 py-4 text-gray-300">{new Date(log.date).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 font-medium text-gray-100">{log.fuelConsumed.toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-100">{log.fuelRemaining.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end items-center space-x-2">
                       <button onClick={() => handleOpenModal(log)} className="p-1 rounded hover:bg-gray-600" title="Sửa"><PencilIcon className="w-4 h-4" /></button>
                       <button onClick={() => handleDelete(log.id)} className="p-1 rounded hover:bg-gray-600 text-red-400" title="Xóa"><TrashIcon className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && (
        <AddOrEditFuelLogModal
          log={editingLog}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default FuelPanel;
