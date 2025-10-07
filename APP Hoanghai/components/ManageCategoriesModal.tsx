import React, { useState } from 'react';
import XMarkIcon from './icons/XMarkIcon';
import PlusIcon from './icons/PlusIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import CheckIcon from './icons/CheckIcon';

interface Props {
  categories: string[];
  onAdd: (newCategory: string) => void;
  onUpdate: (oldCategory: string, newCategory: string) => void;
  onDelete: (categoryToDelete: string) => void;
  onClose: () => void;
}

const ManageCategoriesModal: React.FC<Props> = ({ categories, onAdd, onUpdate, onDelete, onClose }) => {
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(newCategory);
        setNewCategory('');
    };

    const startEditing = (category: string) => {
        setEditingCategory(category);
        setEditingValue(category);
    };

    const cancelEditing = () => {
        setEditingCategory(null);
        setEditingValue('');
    };

    const saveEditing = () => {
        if (editingCategory) {
            onUpdate(editingCategory, editingValue);
        }
        cancelEditing();
    };

    const handleDelete = (category: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category}"?`)) {
            onDelete(category);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Quản lý danh mục chi phí</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 mb-6">
                    {categories.map(cat => (
                        <div key={cat} className="flex items-center justify-between bg-gray-700 p-3 rounded-md group">
                            {editingCategory === cat ? (
                                <input
                                    type="text"
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveEditing();
                                        if (e.key === 'Escape') cancelEditing();
                                    }}
                                    className="flex-grow bg-gray-900/80 text-white border-blue-500 border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    autoFocus
                                />
                            ) : (
                                <span className="text-gray-200">{cat}</span>
                            )}
                            <div className="flex items-center space-x-2">
                                {editingCategory === cat ? (
                                    <>
                                        <button onClick={saveEditing} className="p-1 rounded hover:bg-gray-600 text-green-400" title="Lưu"><CheckIcon className="w-5 h-5"/></button>
                                        <button onClick={cancelEditing} className="p-1 rounded hover:bg-gray-600 text-gray-400" title="Hủy"><XMarkIcon className="w-5 h-5"/></button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEditing(cat)} className="p-1 rounded hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Sửa"><PencilIcon className="w-4 h-4"/></button>
                                        <button onClick={() => handleDelete(cat)} className="p-1 rounded hover:bg-gray-600 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Xóa"><TrashIcon className="w-4 h-4"/></button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAdd} className="flex items-center space-x-3 pt-4 border-t border-gray-700">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="Thêm danh mục mới..."
                        required
                    />
                    <button type="submit" className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-colors font-semibold" title="Thêm danh mục">
                        <PlusIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManageCategoriesModal;
