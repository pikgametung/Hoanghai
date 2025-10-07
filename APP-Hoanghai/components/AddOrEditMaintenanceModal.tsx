
import React, { useState, FormEvent } from 'react';
import { MaintenanceRecord, MaintenanceStatus } from '../types';
import XMarkIcon from './icons/XMarkIcon';

interface Props {
  record: MaintenanceRecord | null;
  onSave: (data: Omit<MaintenanceRecord, 'id' | 'shipId'>) => void;
  onClose: () => void;
}

const AddOrEditMaintenanceModal: React.FC<Props> = ({ record, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        task: record?.task || '',
        dueDate: record?.dueDate ? record.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
        status: record?.status || MaintenanceStatus.SCHEDULED,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.task.trim()) {
            alert('Vui lòng nhập tên công việc.');
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
                    <h2 className="text-xl font-bold text-white">{record ? 'Chỉnh sửa' : 'Thêm'} nhiệm vụ bảo trì</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="task" className="block text-sm font-medium text-gray-300 mb-1">Công việc</label>
                        <input
                            type="text"
                            id="task"
                            name="task"
                            value={formData.task}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1">Ngày hết hạn</label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Trạng thái</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                        >
                            {Object.values(MaintenanceStatus).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
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

export default AddOrEditMaintenanceModal;
