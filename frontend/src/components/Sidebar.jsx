// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({user}) => {
  const navigate = useNavigate();
  const [isSwitchesOpen, setIsSwitchesOpen] = useState(false);
  const [isSensorsOpen, setIsSensorsOpen] = useState(false);

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    
    {/* Logo Section */}
    <div className="flex h-20 items-center border-b border-gray-200 px-6 dark:border-gray-700">
        <div className="flex items-center gap-3">
        <svg
      className="h-8 w-8 text-blue-600 dark:text-blue-400"
      viewBox="0 0 512 512"
      fill="currentColor"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M301.821 185.795l-5.72-2.288c-22.486-8.995-57.716-8.995-80.202 0l-5.72 2.288c-23.64 9.456-42.159 36.808-42.159 62.27V424.02c0 26.462 21.528 47.99 47.99 47.99h79.979c26.462 0 47.99-21.528 47.99-47.99V248.064C343.98 222.603 325.461 195.251 301.821 185.795zM295.99 456.01H216.01c-17.64 0-31.99-14.351-31.99-31.99v-8.091c34.97-0.777 59.995-6.7 71.98-16.65 11.985 9.95 37.01 15.873 71.98 16.65v8.091C327.98 441.66 313.629 456.01 295.99 456.01zM327.98 399.924C279.563 398.778 264 387.379 264 384.03v-23.994c0-4.418-3.582-8-8-8-4.418 0-8 3.582-8 8v23.994c0 3.348-15.563 14.747-63.98 15.893V248.064c0-18.741 14.7-40.454 32.101-47.414l5.72-2.288c9.258-3.703 21.708-5.555 34.159-5.555 12.45 0 24.901 1.852 34.159 5.555l5.72 2.288c17.401 6.96 32.101 28.673 32.101 47.414V399.924z"
      />
      <path
        d="M275.221 264.37c-6.222 9.474-10.921 15.684-19.221 15.684-8.3 0-12.999-6.21-19.22-15.684-5.02-7.644-10.708-16.308-20.769-16.308-10.151 0-18.862 6.109-21.675 15.201-2.698 8.72.812 17.685 9.159 23.396 3.647 2.496 8.625 1.562 11.12-2.085s1.562-8.625-2.085-11.12c-1.731-1.185-3.642-3.094-2.909-5.462.585-1.893 2.835-3.93 6.39-3.93 1.426 0 5.608 6.37 7.395 9.09 6.347 9.665 15.039 22.902 32.595 22.902s26.248-13.237 32.595-22.902c1.786-2.72 5.969-9.09 7.395-9.09 3.555 0 5.804 2.037 6.39 3.93.732 2.368-1.178 4.277-2.909 5.462-3.646 2.495-4.58 7.474-2.085 11.12 2.495 3.646 7.473 4.579 11.12 2.085 8.347-5.711 11.857-14.676 9.159-23.396-2.813-9.092-11.523-15.201-21.675-15.201C285.929 248.063 280.24 256.726 275.221 264.37z"
      />
      <path
        d="M291.421 417.453c-9.438 6.565-20.904 6.565-35.421 6.565-14.517 0-25.984 0-35.421-6.565-3.625-2.522-8.612-1.629-11.136 1.999-2.523 3.627-1.628 8.612 1.999 11.136 13.557 9.431 28.615 9.431 44.558 9.431s31.001 0 44.558-9.431c3.627-2.523 4.522-7.509 1.999-11.136C300.034 415.824 295.047 414.93 291.421 417.453z"
      />
      <path
        d="M144.028 144.089c-9.27 0-15.998 10.092-15.998 23.996 0 13.904 6.728 23.996 15.998 23.996s15.998-10.092 15.998-23.996C160.026 154.181 153.298 144.089 144.028 144.089z"
      />
      <path
        d="M367.972 144.089c-9.27 0-15.998 10.092-15.998 23.996 0 13.904 6.728 23.996 15.998 23.996s15.998-10.092 15.998-23.996C383.97 154.181 377.242 144.089 367.972 144.089z"
      />
      <path
        d="M474.95 308.893c-9.939-26.4-25.035-48.08-37.165-65.501-6.285-9.026-11.713-16.822-14.632-22.821-11.397-23.428-15.189-36.609-15.189-68.482 0-22.978-5.782-43.16-17.043-60.157.648-1.138 1.029-2.449 1.047-3.852.002-0.181.218-18.343-.5-37.203-1.435-37.702-5.115-44.463-8.452-47.842C381.083 1.078 378.581 0 375.97 0c-5.901 0-12.575 3.99-25.962 23.462-6.975 10.146-12.723 20.12-12.964 20.54-.85 1.479-1.17 3.114-1.029 4.693-1.683-.718-3.387-1.42-5.127-2.098-36.964-14.407-73.35-14.604-74.894-14.605-1.531.001-37.917.198-74.88 14.605-1.739.678-3.444 1.38-5.127 2.098.141-1.579-.179-3.214-1.029-4.693-.241-.419-5.989-10.393-12.964-20.54C148.605 3.99 141.932 0 136.03 0c-2.611 0-5.113 1.078-7.046 3.035-3.337 3.379-7.017 10.141-8.452 47.842-.718 18.86-.502 37.022-.5 37.203.018 1.402.398 2.714 1.046 3.852-11.26 16.997-17.043 37.179-17.043 60.157 0 31.873-3.792 45.054-15.189 68.482-2.918 5.999-8.347 13.795-14.632 22.821-12.13 17.421-27.226 39.101-37.165 65.501-11.936 31.703-13.471 62.224-4.695 93.307 11.603 41.094 42.651 71.26 92.281 89.661C169.532 508.506 220.853 512 256 512s86.468-3.494 131.363-20.139c49.63-18.401 80.678-48.567 92.282-89.661C488.421 371.117 486.885 340.596 474.95 308.893zM350.913 51.978c7.457-12.962 16.24-25.683 21.921-32.1 1.691 9.781 3.054 29.412 3.184 54.377-7.813-7.427-17.01-13.995-27.583-19.632C349.422 53.962 350.28 53.077 350.913 51.978zM139.165 19.878c5.681 6.417 14.465 19.138 21.922 32.1.633 1.099 1.491 1.984 2.478 2.646-10.573 5.638-19.771 12.205-27.583 19.633C136.109 49.291 137.473 29.66 139.165 19.878zM464.247 397.853c-10.137 35.9-37.875 62.482-82.446 79.006C339.13 492.679 289.837 496 256 496s-83.13-3.321-125.801-19.141c-44.57-16.524-72.309-43.106-82.446-79.006-17.77-62.935 16.75-112.512 39.592-145.317 6.667-9.576 12.425-17.845 15.889-24.965 11.849-24.356 16.802-40.227 16.802-75.481 0-42.683 22.378-73.11 66.512-90.438 34.193-13.424 69.116-13.659 69.445-13.66.345 0 34.886.184 69.083 13.513 44.383 17.299 66.887 47.776 66.887 90.584 0 35.254 4.953 51.125 16.802 75.481 3.464 7.12 9.222 15.389 15.889 24.965C447.497 285.341 482.017 334.917 464.247 397.853z"
      />
    </svg>
          <span className="text-3xl font-semibold text-gray-800 dark:text-white">
            CapyHub
          </span>
        </div>
      </div>
    
    <div className="overflow-y-auto py-5 px-3 h-full">
        <ul className="space-y-2">
        {/* Dashboard */}
        <li>
            <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center w-full p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
            <svg 
                className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
            </svg>
            <span className="ml-3">Dashboard</span>
            </button>
        </li>

        {/* Groups */}
        <li>
            <button
            type="button"
            onClick={() => navigate('/groups')}
            className="flex items-center w-full p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
            <svg 
                className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
            <span className="ml-3">Groups</span>
            </button>
        </li>

        {/* Devices */}
        <li>
            <button
            type="button"
            onClick={() => navigate('/devices')}
            className="flex items-center w-full p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
            <svg 
                className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
            </svg>
            <span className="ml-3">Devices</span>
            </button>
        </li>

        {/* Switches Dropdown */}
        <li>
            <button 
            type="button"
            onClick={() => setIsSwitchesOpen(!isSwitchesOpen)}
            className="flex items-center w-full p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
            <svg 
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path d="M17 17H7C4.51 17 2.5 14.99 2.5 12.5C2.5 10.01 4.51 8 7 8H17C19.49 8 21.5 10.01 21.5 12.5C21.5 14.99 19.49 17 17 17Z" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7.42737 15C8.80808 15 9.92737 13.8807 9.92737 12.5C9.92737 11.1193 8.80808 10 7.42737 10C6.04666 10 4.92737 11.1193 4.92737 12.5C4.92737 13.8807 6.04666 15 7.42737 15Z" stroke-miterlimit="10"/>
            </svg>
            <span className="flex-1 ml-3 text-left whitespace-nowrap">Switches</span>
            <svg 
                className="w-6 h-6" 
                fill="currentColor" 
                viewBox="0 0 20 20"
            >
                <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd"
                />
            </svg>
            </button>
            {isSwitchesOpen && (
            <ul className="py-2 space-y-2">
                <li>
                <button 
                    type="button"
                    onClick={() => navigate('/switches/push-button')}
                    className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Push Button
                </button>
                </li>
                <li>
                <button 
                    type="button"
                    onClick={() => navigate('/switches/toggle-switch')}
                    className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Toggle Switch
                </button>
                </li>
                <li>
                <button 
                    type="button"
                    onClick={() => navigate('/switches/slider')}
                    className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Slider
                </button>
                </li>
                <li>
                <button 
                    type="button"
                    onClick={() => navigate('/switches/color-picker')}
                    className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Color Picker
                </button>
                </li>
            </ul>
            )}
        </li>

        {/* Sensors Dropdown */}
        <li>
            <button 
            type="button"
            onClick={() => setIsSensorsOpen(!isSensorsOpen)}
            className="flex items-center w-full p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
            <svg 
                className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path d="M8.46447 15.5355C6.51185 13.5829 6.51185 10.4171 8.46447 8.46447M5.63592 18.364C2.1212 14.8493 2.1212 9.15077 5.63592 5.63605M15.5355 15.5355C17.4881 13.5829 17.4881 10.4171 15.5355 8.46447M18.364 18.364C21.8788 14.8493 21.8788 9.15077 18.364 5.63605M13 12.0001C13 12.5523 12.5523 13.0001 12 13.0001C11.4477 13.0001 11 12.5523 11 12.0001C11 11.4478 11.4477 11.0001 12 11.0001C12.5523 11.0001 13 11.4478 13 12.0001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span className="flex-1 ml-3 text-left whitespace-nowrap">Sensors</span>
            <svg 
                className="w-6 h-6" 
                fill="currentColor" 
                viewBox="0 0 20 20"
            >
                <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd"
                />
            </svg>
            </button>
            {isSensorsOpen && (
            <ul className="py-2 space-y-2">
                <li>
                <button 
                    type="button"
                    onClick={() => navigate('/sensors/notifications')}
                    className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Notifications
                </button>
                </li>
                <li>
                <button 
                    type="button"
                    onClick={() => navigate('/sensors/widgets')}
                    className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Widgets
                </button>
                </li>
                <li>
                <button 
                    type="button"
                    onClick={() => navigate('/sensors/gauges')}
                    className="flex items-center p-2 pl-11 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Gauges
                </button>
                </li>
            </ul>
            )}
        </li>

        {/* GitHub Link */}
        <li>
            <button 
            type="button"
            onClick={() => window.open("https://github.com/PinkCapybara/CapyHub", "_blank")}
            className="flex items-center w-full p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            >
            <svg 
                className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
            </svg>
            <span className="ml-3">GitHub</span>
            </button>
        </li>
        </ul>
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center">
            <div className="flex-shrink-0">
                <span className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{user.firstName[0] + user.lastName[0]}</span>
                </span>
            </div>
            <div className="ml-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">@{user.username}</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
            </div>
            </div>
        </div>
    </div>
    </aside>
  );
};

export default Sidebar;