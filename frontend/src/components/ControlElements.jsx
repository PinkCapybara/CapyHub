// PushButton, ToggleSwitch, Gauge, ColorPicker, Slider, Widget
import React, {useState} from "react"
import { deviceStatusAtom } from "../store/gdAtoms"
import { useRecoilValue } from "recoil"
import { SunIcon, MoonIcon, CloudIcon, FireIcon, BeakerIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { pushAction, toggleActionOn, toggleActionOff, slideAction, colorAction } from '../services/api/endpoints'; 

// Mapping for widget icons
const ICON_MAP = {
  sun: SunIcon,
  moon: MoonIcon,
  cloud: CloudIcon,
  fire: FireIcon,
  beaker: BeakerIcon,
  'light-bulb': LightBulbIcon,
};

export const PushButton = ({ 
    name,
    deviceName,
    groupName,
    device,
    ...element
  }) => {
    const handlePush = () => {
      pushAction(element);
    };
  
    return (
      <div className="bg-gray-700 p-4 rounded-xl border border-gray-700">
        {/* Title with Status */}
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <StatusIndicator deviceId={device} />
        </div>
  
        {/* Device Metadata */}
        <div className="flex gap-2 text-sm text-gray-400 mb-4">
          <span>{deviceName}</span>
          <span>•</span>
          <span>{groupName}</span>
        </div>
  
        {/* Button */}
        <button
          onClick={handlePush}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 
                   text-white font-medium rounded-lg transform transition-all duration-150 
                   active:scale-95 shadow-md hover:shadow-lg"
        >
          {name}
        </button>
      </div>
    );
  };

  export const ToggleSwitch = ({ 
    name,
    deviceName,
    groupName,
    device,
    value,
    ...element
  }) => {
    const handleToggle = (checked) => {
      if (checked) {
        toggleActionOn(element);
      } else {
        toggleActionOff(element);
      }
    };
  
    return (
      <div className="bg-gray-700 p-4 rounded-xl border border-gray-700">
        {/* Title with Status */}
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <StatusIndicator deviceId={device} />
        </div>
  
        {/* Device Metadata */}
        <div className="flex justify-between pr-4 text-sm text-gray-400 mb-1">
            <div>
          <span>{deviceName}</span>
          <span>•</span>
          <span>{groupName}</span>
          </div>
          {/* Toggle Control */}
        <span className="flex">
        <label className="relative inline-flex items-center cursor-pointer w-11 h-6">
          <input
            type="checkbox"
            checked={value === 1}
            onChange={(e) => handleToggle(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-500 peer-checked:bg-blue-600 rounded-full transition-colors duration-300"></div>
          <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-full"></div>
        </label>
        </span>
        </div>
      </div>
    );
  };

  export const Slider = ({ _id, name, device, deviceName, groupName, minValue, maxValue, value}) => {

    const handleChange = (e) => {
      const newVal = e.target.value;
      slideAction({_id}, newVal);
    };
  
    return (
      <div className="bg-gray-700 p-4 rounded-xl border border-gray-700">
        {/* Title with Status */}
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <StatusIndicator deviceId={device} />
        </div>
  
        {/* Device Metadata */}
        <div className="flex gap-2 text-sm text-gray-400 mb-4">
          <span>{deviceName}</span>
          <span>•</span>
          <span>{groupName}</span>
        </div>
        {/* Slider Control */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">{minValue}</span>
          <input
            type="range"
            min={minValue}
            max={maxValue}
            value={value}
            onChange={handleChange}
            className="flex-1 accent-indigo-500"
          />
          <span className="text-sm text-gray-400">{maxValue}</span>
        </div>
        {/* Current Value */}
        <div className="text-center mt-2">
          <span className="text-lg font-bold text-indigo-400">{value}</span>
        </div>
      </div>
    );
  };
  

  export const ColorPicker = ({ _id, name, device, deviceName, groupName, value }) => {
    const handleChange = (e) => {
      const raw = e.target.value;
      const newColor = raw.toString().toUpperCase();
      slideAction({ _id }, newColor);
    };
  
    return (
      <div className="bg-gray-700 p-4 rounded-xl border border-gray-700">
        {/* Title with Status */}
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <StatusIndicator deviceId={device} />
        </div>
  
        {/* Device Metadata */}
        <div className="flex gap-2 text-sm text-gray-400 mb-4">
          <span>{deviceName}</span>
          <span>•</span>
          <span>{groupName}</span>
        </div>
        {/* Color Picker Input */}
        <div className="flex items-center gap-2 mb-2">
          <input
            type="color"
            value={value}
            onChange={handleChange}
            className="h-10 w-10 p-0 border-0"
          />
          <span className="text-sm text-gray-400">{value}</span>
        </div>
      </div>
    );
  };

export const Gauge = ({ 
    name,
    deviceName,
    groupName,
    minValue,
    maxValue,
    value,
    device
  }) => {  
    // Protect against zero-range
    const range = maxValue - minValue;
    const percentage =
      range > 0
        ? Math.min(100, Math.max(0, ((value - minValue) / range) * 100))
        : 0;
  
    return (
      <div className="bg-gray-700 p-4 rounded-xl border border-gray-700">
        {/* Title with Status Dot */}
        <div className="mb-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            <StatusIndicator deviceId={device} />
          </div>
          <div className="flex gap-2 text-sm text-gray-400 mt-1">
            <span>{deviceName}</span>
            <span>•</span>
            <span>{groupName}</span>
          </div>
        </div>
  
        {/* Meter with Visible Fill */}
        <div className="relative h-6 w-full bg-gray-800 rounded-full overflow-hidden mb-2">
        <div
        className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${percentage}%` }}
        />
        </div>
  
        {/* Value Display */}
        <div className="flex justify-between items-center text-gray-300">
          <span className="text-sm">{minValue}</span>
          <span className="text-lg font-bold text-blue-400">{value}</span>
          <span className="text-sm">{maxValue}</span>
        </div>
      </div>
    );
  };

  export const Widget = ({
    name,
    unit,
    value,
    icon,
    deviceName,
    groupName,
    device
  }) => {
    const IconComponent = ICON_MAP[icon] || SunIcon;
    
    return (
      <div className="bg-gray-700 p-4 rounded-xl border border-gray-700 hover:shadow-lg transition">
        {/* Title with Status */}
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <IconComponent className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">{name}</h3>
          </div>
          <StatusIndicator deviceId={device} />
        </div>
  
        {/* Device Metadata */}
        <div className="flex gap-2 text-sm text-gray-400 mb-2">
          <span>{deviceName}</span>
          <span>•</span>
          <span>{groupName}</span>
        </div>
  
        {/* Value Display */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyan-400">{value}</span>
          <span className="text-md text-gray-400">{unit}</span>
        </div>
      </div>
    );
  };

  const StatusIndicator = ({ deviceId }) => {
    const devices = useRecoilValue(deviceStatusAtom);
    const device = devices.find(d => d.deviceId === deviceId);
    
    return (
      <span className={`w-2 h-2 rounded-full ${
        device?.isOnline ? 'bg-green-500' : 'bg-red-500'
      }`} />
    );
  };