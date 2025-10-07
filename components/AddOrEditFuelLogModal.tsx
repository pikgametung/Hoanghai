
import React, { useState, FormEvent } from 'react';
import { FuelLog } from '../types';
import XMarkIcon from './icons/XMarkIcon';

interface Props {
  log: FuelLog | null;
  onSave: (data: Omit<FuelLog, 'id' | 'shipId'>) => void;
  onClose: () => void;
}

const AddOrEditFuelLogModal: React.FC<Props> = ({ log, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        date: log?.date ? log.date.split('T')[0] : new Date().toISOString().split('T')[0],
        fuelConsumed: log?.fuelConsumed || 0,
        fuelRemaining: log?.fuelRemaining || 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (formData.fuelConsumed < 0 || formData.fuelRemaining < 0) {
            alert('Giá trị nhiên liệu không thể là số âm.');
            return;
        }
        onSave(formData);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">{log ? 'Chỉnh sửa' : 'Thêm'} bản ghi nhiên liệu</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Ngày</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="fuelConsumed" className="block text-sm font-medium text-gray-300 mb-1">Nhiên liệu đã tiêu thụ (tấn)</label>
                        <input
                            type="number"
                            id="fuelConsumed"
                            name="fuelConsumed"
                            value={formData.fuelConsumed}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="fuelRemaining" className="block text-sm font-medium text-gray-300 mb-1">Nhiên liệu còn lại (tấn)</label>
                        <input
                            type="number"
                            id="fuelRemaining"
                            name="fuelRemaining"
                            value={formData.fuelRemaining}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 text-gray-200 hover:bg-gray-500 transition-colors">Hủy</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors font-semibold">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOrEditFuelLogModal;
