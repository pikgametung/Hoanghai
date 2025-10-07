import React from 'react';
import ShipIcon from './icons/ShipIcon';
import Bars3Icon from './icons/Bars3Icon';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-gray-800/70 backdrop-blur-sm shadow-md p-4 border-b border-gray-700 z-20 sticky top-0">
      <div className="container mx-auto flex items-center">
        <button 
          onClick={onMenuClick}
          className="md:hidden mr-4 p-2 rounded-full text-gray-300 hover:bg-gray-700 transition-colors"
          aria-label="Mở menu"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <ShipIcon className="w-8 h-8 text-blue-400 mr-3" />
        <h1 className="text-xl font-bold text-white tracking-wider">
          Bảng Điều Khiển Quản Lý Đội Tàu
        </h1>
      </div>
    </header>
  );
};

export default Header;