import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, HomeIcon, UserGroupIcon, DeviceTabletIcon, SwatchIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ username }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSwitches, setShowSwitches] = useState(false);
  const [showElements, setShowElements] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className={`h-screen bg-gray-800 text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-center">
          {isCollapsed ? (
            <span className="text-2xl font-bold">C</span>
          ) : (
            <span className="text-2xl font-bold">CapyHub</span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink 
            to="/" 
            className={({ isActive }) => `flex items-center p-2 rounded-lg hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`}
          >
            <HomeIcon className="h-6 w-6 mr-2" />
            {!isCollapsed && 'Dashboard'}
          </NavLink>

          <NavLink
            to="/groups"
            className={({ isActive }) => `flex items-center p-2 rounded-lg hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`}
          >
            <UserGroupIcon className="h-6 w-6 mr-2" />
            {!isCollapsed && 'Groups'}
          </NavLink>

          <NavLink
            to="/devices"
            className={({ isActive }) => `flex items-center p-2 rounded-lg hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`}
          >
            <DeviceTabletIcon className="h-6 w-6 mr-2" />
            {!isCollapsed && 'Devices'}
          </NavLink>

          {/* GitHub Link */}
          <a
            href="https://github.com/PinkCapybara/CapyHub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-2 rounded-lg hover:bg-gray-700 absolute bottom-16 w-[calc(100%-2rem)]"
          >
            <CodeBracketIcon className="h-6 w-6 mr-2" />
            {!isCollapsed && 'GitHub'}
          </a>
        </nav>

        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="p-4 border-t border-gray-700 hover:bg-gray-700"
        >
          {isCollapsed ? (
            <ChevronDoubleRightIcon className="h-6 w-6" />
          ) : (
            <ChevronDoubleLeftIcon className="h-6 w-6" />
          )}
        </button>

        {/* Username */}
        <div className="p-4 border-t border-gray-700 text-center truncate">
          {!isCollapsed && username}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;