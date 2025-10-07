
import React, { useState, useMemo } from 'react';
import { Cost, CostType, Trip } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import PlusIcon from './icons/PlusIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import AddOrEditCostModal from './AddOrEditCostModal';
import ManageCategoriesModal from './ManageCategoriesModal';
import CogIcon from './icons/CogIcon';

interface CostPanelProps {
  shipId: number;
  costs: Cost[];
  trips: Trip[];
  costCategories: string[];
  onAdd: (data: Omit<Cost, 'id'>) => void;
  onUpdate: (id: number, data: Partial<Omit<Cost, 'id'>>) => void;
  onDelete: (id: number) => void;
  onAddCategory: (newCategory: string) => void;
  onUpdateCategory: (oldCategory: string, newCategory: string) => void;
  onDeleteCategory: (categoryToDelete: string) => void;
}

const PIE_COLORS = {
    'Thu': '#34D399', // Green
    'Chi': '#F87171', // Red
};

const CostTable: React.FC<{
  title: string;
  costs: Cost[];
  onEdit: (cost: Cost) => void;
  onDelete: (id: number) => void;
}> = ({ title, costs, onEdit, onDelete }) => {
  const totalAmount = costs.reduce((sum, cost) => sum + cost.amount, 0);

  return (
    <div>
      <h4 className="text-lg font-semibold text-white mb-3">{title}</h4>
      <div className="overflow-x-auto bg-gray-700/50 rounded-lg max-h-80 overflow-y-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b border-gray-600 text-xs text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-700/50 backdrop-blur-sm">
            <tr>
              <th scope="col" className="px-3 py-3 sm:px-6">Ngày</th>
              <th scope="col" className="px-3 py-3 sm:px-6">Mô tả</th>
              <th scope="col" className="px-3 py-3 sm:px-6">Hạng mục</th>
              <th scope="col" className="px-3 py-3 sm:px-6 text-right">Số tiền</th>
              <th scope="col" className="px-2 py-3"><span className="sr-only">Hành động</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {costs.map((cost) => (
              <tr key={cost.id} className="hover:bg-gray-700/70 group">
                <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-300 whitespace-nowrap">{new Date(cost.date).toLocaleDateString('vi-VN')}</td>
                <td className="px-3 py-3 sm:px-6 sm:py-4 text-gray-200">{cost.description}</td>
                <td className="px-3 py-3 sm:px-6 sm:py-4 font-medium text-gray-300">{cost.category}</td>
                <td className="px-3 py-3 sm:px-6 sm:py-4 font-medium text-gray-100 text-right">{cost.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                <td className="px-2 py-4 text-right">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end items-center space-x-1">
                    <button onClick={() => onEdit(cost)} className="p-1 rounded hover:bg-gray-600" title="Sửa"><PencilIcon className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(cost.id)} className="p-1 rounded hover:bg-gray-600 text-red-400" title="Xóa"><TrashIcon className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-800/70 font-bold">
              <td colSpan={3} className="px-3 sm:px-6 py-3 text-right text-gray-300 uppercase">Tổng cộng</td>
              <td className="px-3 sm:px-6 py-3 text-right text-white">{totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};


const CostPanel: React.FC<CostPanelProps> = ({ shipId, costs, trips, costCategories, onAdd, onUpdate, onDelete, onAddCategory, onUpdateCategory, onDeleteCategory }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<Cost | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [activeTripId, setActiveTripId] = useState<'all' | 'general' | number>('all');

  const handleOpenModal = (cost: Cost | null = null) => {
    setEditingCost(cost);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCost(null);
  };
  
  const handleSave = (data: Omit<Cost, 'id'>) => {
    if (editingCost) {
      onUpdate(editingCost.id, data);
    } else {
      onAdd({ shipId, ...data });
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if(window.confirm('Bạn có chắc chắn muốn xóa bản ghi chi phí này không?')) {
      onDelete(id);
    }
  };

  const { income, expenses } = useMemo(() => {
    const filtered = costs.filter(cost => {
      if (activeTripId === 'all') return true;
      if (activeTripId === 'general') return !cost.tripId;
      return cost.tripId === activeTripId;
    });
    const income = filtered.filter(c => c.type === CostType.INCOME);
    const expenses = filtered.filter(c => c.type === CostType.EXPENSE);
    return { income, expenses };
  }, [costs, activeTripId]);
  
  const totalIncome = useMemo(() => income.reduce((sum, item) => sum + item.amount, 0), [income]);
  const totalExpenses = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const profit = totalIncome - totalExpenses;

  const pieData = useMemo(() => {
    const data = [];
    if (totalIncome > 0) data.push({ name: 'Thu', value: totalIncome });
    if (totalExpenses > 0) data.push({ name: 'Chi', value: totalExpenses });
    return data;
  }, [totalIncome, totalExpenses]);

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold text-white">Tổng quan Tài chính</h3>
            <div className="mt-2 mb-4 space-y-1">
                 <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    Lợi nhuận: {profit.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                 </p>
                 <p className="text-sm text-gray-300">
                    <span className="text-green-400">Tổng Thu:</span> {totalIncome.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                 </p>
                 <p className="text-sm text-gray-300">
                    <span className="text-red-400">Tổng Chi:</span> {totalExpenses.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                 </p>
            </div>
            <div className="h-[300px]">
                {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8">
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name as keyof typeof PIE_COLORS]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4A5568', color: '#E5E7EB' }}
                        formatter={(value: number) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    />
                    <Legend wrapperStyle={{color: '#E5E7EB', paddingTop: '20px'}}/>
                    </PieChart>
                </ResponsiveContainer>
                ) : <div className="flex items-center justify-center h-full text-gray-500">Không có dữ liệu Thu/Chi.</div> }
            </div>
        </div>

        <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Sổ sách Thu & Chi</h3>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setIsManageModalOpen(true)} className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md bg-gray-600 hover:bg-gray-500 transition-colors" title="Quản lý danh mục">
                        <CogIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleOpenModal()} className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-500 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Thêm mới</span>
                    </button>
                </div>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-4">
                <button onClick={() => setActiveTripId('all')} className={`trip-filter ${activeTripId === 'all' ? 'active' : ''}`}>Tất cả</button>
                <button onClick={() => setActiveTripId('general')} className={`trip-filter ${activeTripId === 'general' ? 'active' : ''}`}>Chung</button>
                {trips.map(t => (
                    <button key={t.id} onClick={() => setActiveTripId(t.id)} className={`trip-filter ${activeTripId === t.id ? 'active' : ''}`}>{t.name}</button>
                ))}
            </div>
            <style>{`.trip-filter { flex-shrink: 0; padding: 0.5rem 1rem; border-radius: 9999px; background-color: #374151; color: #D1D5DB; font-weight: 500; transition: all 0.2s; white-space: nowrap; } .trip-filter:hover { background-color: #4B5563; } .trip-filter.active { background-color: #2563EB; color: white; }`}</style>
            
            <div className="space-y-8">
                <CostTable title="Thu" costs={income} onEdit={handleOpenModal} onDelete={handleDelete} />
                <CostTable title="Chi" costs={expenses} onEdit={handleOpenModal} onDelete={handleDelete} />
            </div>
        </div>
      </div>

      {isModalOpen && (
        <AddOrEditCostModal
          cost={editingCost}
          categories={costCategories}
          trips={trips}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
      {isManageModalOpen && (
          <ManageCategoriesModal
              categories={costCategories}
              onAdd={onAddCategory}
              onUpdate={onUpdateCategory}
              onDelete={onDeleteCategory}
              onClose={() => setIsManageModalOpen(false)}
          />
      )}
    </div>
  );
};

export default CostPanel;
