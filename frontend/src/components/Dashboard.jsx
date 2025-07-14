import React from "react";
import "../App.css";
import { useRecoilValue } from "recoil";
import { devicesAtom } from "../store/gdAtoms";
import { gaugeSensorsAtom, widgetSensorsAtom } from "../store/sensorAtoms";
import {
  pushSwitchesAtom,
  toggleSwitchesAtom,
  sliderSwitchesAtom,
  colorPickerSwitchesAtom,
} from "../store/switchAtoms";
import {
  PushButton,
  ToggleSwitch,
  Gauge,
  ColorPicker,
  Slider,
  Widget,
} from "./ControlElements";

export const Dashboard = () => {
  const switchElements = {
    push: useRecoilValue(pushSwitchesAtom),
    toggle: useRecoilValue(toggleSwitchesAtom),
    slider: useRecoilValue(sliderSwitchesAtom),
    color: useRecoilValue(colorPickerSwitchesAtom),
  };

  const sensorElements = {
    gauge: useRecoilValue(gaugeSensorsAtom),
    widget: useRecoilValue(widgetSensorsAtom),
  };

  const DeviceStatusSection = () => {
    const deviceStatus = useRecoilValue(devicesAtom);

    return (
      <section className="h-full flex flex-col bg-gray-800 rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4 text-white">Device Status</h2>
        <div className="grid grid-cols-1 gap-3 overflow-y-auto">
          {deviceStatus.map((device) => (
            <div
              key={device._id}
              className="bg-gray-700 h-auto p-3 rounded-lg flex items-center"
            >
              <div className="flex-1">
                <h3 className="font-medium text-white">{device.name}</h3>
              </div>
              <div className="text-right space-y-1.5">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-sm font-medium text-gray-400">
                    {device.isOnline ? "Online" : "Offline"}
                  </span>
                  <div
                    className={`w-3 h-3 rounded-full ${device.isOnline ? "bg-green-500" : "bg-red-500"}`}
                  />
                </div>
                <p className="text-sm font-medium mb-1 text-gray-400">
                  Signal Strength:{" "}
                  <span className="text-sm font-medium mb-1 text-white">
                    {device.strength}%
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const SwitchSection = ({ title, elements, component: Component }) => (
    <div className="h-full flex flex-col bg-gray-800 rounded-xl p-4">
      <h3 className="text-lg font-medium mb-3 text-white">{title}</h3>
      <div className="grid h-auto grid-cols-2 md:grid-cols-3 gap-2 overflow-y-auto flex">
        {elements.map((element) => (
          <Component key={element._id} {...element} />
        ))}
      </div>
    </div>
  );

  const SensorSection = ({ title, elements, component: Component }) => (
    <div className="h-full flex flex-col bg-gray-800 rounded-xl p-4">
      <h3 className="text-lg font-medium mb-4 text-white">{title}</h3>
      <div className="grid grid-cols-1 h-auto gap-4 overflow-y-auto flex">
        {elements.map((element) => (
          <Component key={element._id} {...element} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="overflow-y-auto custom-scrollbar h-screen bg-gray-900 text-white p-6 pb-10 mb-10 flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Control Dashboard</h1>
        <p className="text-white/80 mt-2">
          Real-time device monitoring and control
        </p>
      </header>

      {/* Top Row - Main Monitoring */}
      <div className="grid grid-cols-3 gap-6 mb-6 flex-1 min-h-0">
        <SensorSection
          title="Measurement Gauges"
          elements={sensorElements.gauge}
          component={Gauge}
        />
        <SensorSection
          title="Data Widgets"
          elements={sensorElements.widget}
          component={Widget}
        />
        <DeviceStatusSection />
      </div>

      {/* Bottom Row - Controls */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 flex-1 min-h-0">
        <SwitchSection
          title="Push Buttons"
          elements={switchElements.push}
          component={PushButton}
        />
        <SwitchSection
          title="Toggle Switches"
          elements={switchElements.toggle}
          component={ToggleSwitch}
        />
        <SwitchSection
          title="Slider Controls"
          elements={switchElements.slider}
          component={Slider}
        />
        <SwitchSection
          title="Color Pickers"
          elements={switchElements.color}
          component={ColorPicker}
        />
      </div>
    </div>
  );
};
