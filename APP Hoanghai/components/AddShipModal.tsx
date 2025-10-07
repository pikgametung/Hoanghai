
import React, { useState, FormEvent } from 'react';
import { Ship } from '../types';
import XMarkIcon from './icons/XMarkIcon';

interface AddShipModalProps {
  onAddShip: (newShipData: Omit<Ship, 'id' | 'status' | 'latitude' | 'longitude' | 'captain' | 'builtYear' | 'flag' | 'speed'>) => void;
  onClose: () => void;
}

const AddShipModal: React.FC<AddShipModalProps> = ({ onAddShip, onClose }) => {
    const [name, setName] = useState('');
    const [imo, setImo] = useState(''); // This is for MMSI
    const [trueImo, setTrueImo] = useState(''); // This is for IMO
    const [type, setType] = useState('Tàu container');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !imo.trim() || !trueImo.trim() || !type.trim()) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        onAddShip({ name, imo, trueImo, type });
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-ship-title"
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 id="add-ship-title" className="text-xl font-bold text-white">Thêm tàu mới</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="ship-name" className="block text-sm font-medium text-gray-300 mb-1">Tên tàu</label>
                        <input
                            type="text"
                            id="ship-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Ví dụ: Ever Ace"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="ship-mmsi" className="block text-sm font-medium text-gray-300 mb-1">Số MMSI</label>
                        <input
                            type="text"
                            id="ship-mmsi"
                            value={imo}
                            onChange={(e) => setImo(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Ví dụ: 636021021"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="ship-imo" className="block text-sm font-medium text-gray-300 mb-1">Số IMO</label>
                        <input
                            type="text"
                            id="ship-imo"
                            value={trueImo}
                            onChange={(e) => setTrueImo(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Ví dụ: 9893894"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="ship-type" className="block text-sm font-medium text-gray-300 mb-1">Loại tàu</label>
                        <input
                            type="text"
                            id="ship-type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Ví dụ: Tàu container"
                            required
                        />
                    </div>
                    <div className="flex justify-end pt-4 space-x-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-gray-600 text-gray-200 hover:bg-gray-500 transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors font-semibold"
                        >
                            Thêm tàu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddShipModal;