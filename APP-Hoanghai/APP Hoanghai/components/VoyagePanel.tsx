
import React, { useState } from 'react';
import { Trip, Voyage } from '../types';
import PlusIcon from './icons/PlusIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import CheckIcon from './icons/CheckIcon';
import XMarkIcon from './icons/XMarkIcon';

interface VoyagePanelProps {
  shipId: number;
  trips: Trip[];
  voyages: Voyage[];
  onAddTrip: (data: Omit<Trip, 'id'>) => void;
  onUpdateTrip: (id: number, data: Partial<Omit<Trip, 'id'>>) => void;
  onDeleteTrip: (id: number) => void;
  onAddVoyage: (data: Omit<Voyage, 'id'>) => void;
  onUpdateVoyage: (id: number, data: Partial<Omit<Voyage, 'id'>>) => void;
  onDeleteVoyage: (id: number) => void;
}

const statusClasses: Record<string, string> = {
  'Đúng lịch trình': 'text-green-400',
  'Bị trễ': 'text-red-400',
  'Đã hoàn thành': 'text-gray-400',
  'Đã lên lịch': 'text-yellow-400',
};

const emptyVoyage: Omit<Voyage, 'id' | 'shipId' | 'tripId'> = {
  origin: '',
  destination: '',
  etd: '',
  eta: '',
  status: 'Đã lên lịch',
  progress: 0,
};

const emptyTrip: Omit<Trip, 'id' | 'shipId'> = {
  name: '',
  departureDateTime: '',
};

const TripForm: React.FC<{
  trip: Omit<Trip, 'id' | 'shipId'>;
  onSave: (data: Omit<Trip, 'id' | 'shipId'>) => void;
  onCancel: () => void;
}> = ({ trip, onSave, onCancel }) => {
  const [formData, setFormData] = useState(trip);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  return (
    <form onSubmit={handleSubmit} className="bg-gray-700/80 p-4 rounded-lg space-y-4 mb-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} placeholder="Tên chuyến hàng (VD: Hải Phòng - Singapore)" className="input-field" required />
        <div>
            <label className="text-xs text-gray-400">Ngày giờ khởi hành</label>
            <input name="departureDateTime" type="datetime-local" value={formData.departureDateTime} onChange={(e) => setFormData(p => ({...p, departureDateTime: e.target.value}))} className="input-field" required/>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="btn-secondary"><XMarkIcon className="w-5 h-5"/> Hủy</button>
        <button type="submit" className="btn-primary"><CheckIcon className="w-5 h-5"/> Lưu</button>
      </div>
    </form>
  );
};

const VoyageLegForm: React.FC<{
  voyage: Partial<Omit<Voyage, 'id' | 'shipId' | 'tripId'>>;
  onSave: (data: any) => void;
  onCancel: () => void;
}> = ({ voyage, onSave, onCancel }) => {
  const [formData, setFormData] = useState(voyage);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'progress' ? parseInt(value) : value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900/50 p-4 rounded-lg space-y-4 my-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="origin" value={formData.origin} onChange={handleChange} placeholder="Điểm đi" className="input-field" required />
        <input name="destination" value={formData.destination} onChange={handleChange} placeholder="Điểm đến" className="input-field" required />
        <div>
            <label className="text-xs text-gray-400">ETD (Ngày dự kiến đi)</label>
            <input name="etd" type="date" value={formData.etd} onChange={handleChange} className="input-field" required/>
        </div>
        <div>
            <label className="text-xs text-gray-400">ETA (Ngày dự kiến đến)</label>
            <input name="eta" type="date" value={formData.eta} onChange={handleChange} className="input-field" required/>
        </div>
        <select name="status" value={formData.status} onChange={handleChange} className="input-field">
          {Object.keys(statusClasses).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div>
          <label className="block text-sm text-gray-400">Tiến độ: {formData.progress || 0}%</label>
          <input name="progress" type="range" min="0" max="100" value={formData.progress || 0} onChange={handleChange} className="w-full" />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="btn-secondary"><XMarkIcon className="w-5 h-5"/></button>
        <button type="submit" className="btn-primary"><CheckIcon className="w-5 h-5"/></button>
      </div>
    </form>
  )
}


const VoyagePanel: React.FC<VoyagePanelProps> = ({ shipId, trips, voyages, onAddTrip, onUpdateTrip, onDeleteTrip, onAddVoyage, onUpdateVoyage, onDeleteVoyage }) => {
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [editingTripId, setEditingTripId] = useState<number | null>(null);
  const [openTripId, setOpenTripId] = useState<number | null>(trips.length > 0 ? trips[0].id : null);
  const [addingVoyageToTripId, setAddingVoyageToTripId] = useState<number | null>(null);
  const [editingVoyageId, setEditingVoyageId] = useState<number | null>(null);

  const handleSaveTrip = (data: Omit<Trip, 'id' | 'shipId'>) => {
    if (editingTripId) {
        onUpdateTrip(editingTripId, { ...data, shipId });
    } else {
        onAddTrip({ ...data, shipId });
    }
    setIsAddingTrip(false);
    setEditingTripId(null);
  };

  const handleSaveVoyage = (data: Omit<Voyage, 'id' | 'shipId'>) => {
      if (editingVoyageId) {
          onUpdateVoyage(editingVoyageId, data);
      } else if (addingVoyageToTripId) {
          onAddVoyage({ ...emptyVoyage, ...data, shipId, tripId: addingVoyageToTripId });
      }
      setEditingVoyageId(null);
      setAddingVoyageToTripId(null);
  }

  const handleDeleteTrip = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ chuyến hàng này (bao gồm tất cả các chặng) không?')) {
      onDeleteTrip(id);
    }
  };

  const handleDeleteVoyage = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chặng hành trình này không?')) {
      onDeleteVoyage(id);
    }
  };
  
  return (
    <div className="animate-fade-in">
       <style>{`.input-field { width: 100%; background-color: #1F2937; color: white; border-radius: 0.375rem; padding: 0.5rem 0.75rem; border: 1px solid #4B5563; } .btn-primary { display: inline-flex; items-center; justify-content: center; gap: 0.5rem; padding: 0.5rem 1rem; background-color: #2563EB; color: white; border-radius: 0.375rem; font-weight: 600; transition: background-color 0.2s; } .btn-primary:hover { background-color: #1D4ED8; } .btn-secondary { display: inline-flex; items-center; justify-content: center; gap: 0.5rem; padding: 0.5rem 1rem; background-color: #4B5563; color: #D1D5DB; border-radius: 0.375rem; transition: background-color 0.2s; } .btn-secondary:hover { background-color: #6B7280; }`}</style>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Quản lý Chuyến hàng & Hành trình</h3>
        <button onClick={() => {setIsAddingTrip(true); setEditingTripId(null);}} className="btn-primary" title="Thêm chuyến hàng mới">
          <PlusIcon className="w-5 h-5" /> Thêm Chuyến hàng
        </button>
      </div>

      {isAddingTrip && <TripForm trip={emptyTrip} onSave={handleSaveTrip} onCancel={() => setIsAddingTrip(false)} />}
      
      <div className="space-y-4">
        {trips.length === 0 && !isAddingTrip && <p className="text-center text-gray-400 py-8">Chưa có chuyến hàng nào được tạo.</p>}
        {trips.map(trip => {
            const tripVoyages = voyages.filter(v => v.tripId === trip.id);
            const isEditingThis = editingTripId === trip.id;
            const isOpen = openTripId === trip.id;

            return isEditingThis ? (
                <TripForm key={trip.id} trip={trip} onSave={handleSaveTrip} onCancel={() => setEditingTripId(null)} />
            ) : (
                <div key={trip.id} className="bg-gray-700/50 rounded-lg shadow-md group">
                    <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setOpenTripId(isOpen ? null : trip.id)}>
                        <div className="flex items-center space-x-3">
                            <span className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                            <div>
                                <p className="font-bold text-white text-lg">{trip.name}</p>
                                <p className="text-sm text-gray-400">Khởi hành: {new Date(trip.departureDateTime).toLocaleString('vi-VN')}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                           <button onClick={(e) => {e.stopPropagation(); setAddingVoyageToTripId(trip.id); setOpenTripId(trip.id); setEditingVoyageId(null);}} className="btn-primary text-xs px-2 py-1" title="Thêm chặng"><PlusIcon className="w-4 h-4 mr-1"/>Thêm chặng</button>
                           <button onClick={(e) => {e.stopPropagation(); setEditingTripId(trip.id); setIsAddingTrip(false);}} className="p-2 rounded hover:bg-gray-600" title="Sửa chuyến hàng"><PencilIcon className="w-4 h-4"/></button>
                           <button onClick={(e) => {e.stopPropagation(); handleDeleteTrip(trip.id)}} className="p-2 rounded hover:bg-gray-600 text-red-400" title="Xóa chuyến hàng"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                    </div>
                    {isOpen && (
                        <div className="px-4 pb-4 space-y-3 border-t border-gray-600/50 pt-4">
                            {addingVoyageToTripId === trip.id && <VoyageLegForm voyage={emptyVoyage} onSave={handleSaveVoyage} onCancel={() => setAddingVoyageToTripId(null)} />}
                            {tripVoyages.map(voyage => (
                                editingVoyageId === voyage.id ? 
                                <VoyageLegForm key={voyage.id} voyage={voyage} onSave={handleSaveVoyage} onCancel={() => setEditingVoyageId(null)} />
                                :
                                <div key={voyage.id} className="bg-gray-800/60 p-4 rounded-md">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-200">{voyage.origin} → {voyage.destination}</p>
                                            <p className={`text-xs ${statusClasses[voyage.status] || 'text-gray-400'}`}>{voyage.status}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="text-right text-xs text-gray-400">
                                                <p>ETD: {new Date(voyage.etd).toLocaleDateString('vi-VN')}</p>
                                                <p>ETA: {new Date(voyage.eta).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                            <button onClick={() => setEditingVoyageId(voyage.id)} className="p-1 rounded hover:bg-gray-600" title="Sửa chặng"><PencilIcon className="w-4 h-4"/></button>
                                            <button onClick={() => handleDeleteVoyage(voyage.id)} className="p-1 rounded hover:bg-gray-600 text-red-400" title="Xóa chặng"><TrashIcon className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-600 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${voyage.progress}%` }}></div></div>
                                </div>
                            ))}
                             {tripVoyages.length === 0 && addingVoyageToTripId !== trip.id && <p className="text-gray-500 text-center py-4">Chuyến hàng này chưa có chặng hành trình nào.</p>}
                        </div>
                    )}
                </div>
            )
        })}
      </div>
    </div>
  );
};

export default VoyagePanel;