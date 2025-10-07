
import React from 'react';
import ShipIcon from './icons/ShipIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/70 backdrop-blur-sm shadow-md p-4 border-b border-gray-700 z-10">
      <div className="container mx-auto flex items-center">
        <ShipIcon className="w-8 h-8 text-blue-400 mr-3" />
        <h1 className="text-xl font-bold text-white tracking-wider">
          Bảng Điều Khiển Quản Lý Đội Tàu
        </h1>
      </div>
    </header>
  );
};

export default Header;