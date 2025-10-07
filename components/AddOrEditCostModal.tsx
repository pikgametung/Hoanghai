
import React, { useState, FormEvent } from 'react';
import { Cost, CostType, Trip } from '../types';
import XMarkIcon from './icons/XMarkIcon';

interface Props {
  cost: Cost | null;
  categories: string[];
  trips: Trip[];
  onSave: (data: Omit<Cost, 'id' | 'shipId'>) => void;
  onClose: () => void;
}

const AddOrEditCostModal: React.FC<Props> = ({ cost, categories, trips, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        date: cost?.date ? cost.date.split('T')[0] : new Date().toISOString().split('T')[0],
        type: cost?.type || CostType.EXPENSE,
        description: cost?.description || '',
        category: cost?.category || (categories.length > 0 ? categories[0] : ''),
        amount: cost?.amount || 0,
        tripId: cost?.tripId ? String(cost.tripId) : '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // @ts-ignore
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (formData.amount <= 0) {
            alert('Số tiền phải lớn hơn 0.');
            return;
        }
        if (!formData.description.trim()) {
            alert('Vui lòng nhập mô tả.');
            return;
        }

        const { tripId, ...rest } = formData;

        onSave({
          ...rest,
          tripId: tripId ? parseInt(tripId) : undefined,
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">{cost ? 'Chỉnh sửa' : 'Thêm'} bản ghi Thu/Chi</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">Loại</label>
                            <select id="type" name="type" value={formData.type} onChange={handleChange} className="input-field">
                                <option value={CostType.EXPENSE}>Chi</option>
                                <option value={CostType.INCOME}>Thu</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Ngày</label>
                            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="input-field" required />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Mô tả</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} className="input-field" placeholder="Ví dụ: Phí hoa tiêu tại cảng..." required />
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Hạng mục</label>
                            <select id="category" name="category" value={formData.category} onChange={handleChange} className="input-field" required >
                                {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Số tiền (VNĐ)</label>
                            <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} className="input-field" required step="1000" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="tripId" className="block text-sm font-medium text-gray-300 mb-1">Chuyến hàng (Tùy chọn)</label>
                        <select id="tripId" name="tripId" value={formData.tripId} onChange={handleChange} className="input-field">
                            <option value="">Chung (Không thuộc chuyến hàng nào)</option>
                            {trips.map(t => (
                                <option key={t.id} value={String(t.id)}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 text-gray-200 hover:bg-gray-500 transition-colors">Hủy</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors font-semibold">Lưu</button>
                    </div>
                </form>
                <style>{`.input-field { width: 100%; background-color: #374151; border: 1px solid #4B5563; color: white; border-radius: 0.375rem; padding: 0.5rem 0.75rem; transition: border-color 0.2s, box-shadow 0.2s; } .input-field:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4); }`}</style>
            </div>
        </div>
    );
};

export default AddOrEditCostModal;