import React, { useState, useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { devicesAtom, groupsAtom } from "../../store/gdAtoms";
import { elementRefreshAtom } from "../../store/elementAtoms";
import { widgetSensorsAtom } from "../../store/sensorAtoms";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  createWidget,
  editWidget,
  deleteElements,
} from "../../services/api/endpoints";
import { useApiMutation } from "../../hooks/mutationHook";
import {
  SunIcon,
  MoonIcon,
  CloudIcon,
  FireIcon,
  BeakerIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

const ICON_OPTIONS = [
  { value: "sun", label: "Sun", icon: SunIcon },
  { value: "moon", label: "Moon", icon: MoonIcon },
  { value: "cloud", label: "Cloud", icon: CloudIcon },
  { value: "fire", label: "Fire", icon: FireIcon },
  { value: "beaker", label: "Beaker", icon: BeakerIcon },
  { value: "light-bulb", label: "Light Bulb", icon: LightBulbIcon },
];

const CustomIconSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const selectedOption = ICON_OPTIONS.find((option) => option.value === value);

  // Close dropdown if clicked outside.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white flex items-center justify-between focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          {selectedOption ? (
            <>
              <selectedOption.icon className="w-5 h-5" />
              <span>{selectedOption.label}</span>
            </>
          ) : (
            <span>Select Icon</span>
          )}
        </div>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {ICON_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-2 p-2 hover:bg-gray-600 cursor-pointer dark:text-white"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <option.icon className="w-5 h-5" />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Widgets = () => {
  const widgets = useRecoilValue(widgetSensorsAtom);
  const devices = useRecoilValue(devicesAtom);
  const groups = useRecoilValue(groupsAtom);
  const setRefresh = useSetRecoilState(elementRefreshAtom);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formState, setFormState] = useState({
    _id: "",
    name: "",
    device: "",
    subscribeTopic: "",
    unit: "",
    icon: "",
  });

  const { mutate: createMutate, loading: createLoading } =
    useApiMutation(createWidget);
  const { mutate: editMutate, loading: editLoading } =
    useApiMutation(editWidget);
  const { mutate: deleteMutate, loading: deleteLoading } =
    useApiMutation(deleteElements);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formState,
        unit: formState.unit,
        icon: formState.icon,
      };

      if (isEditing) {
        await editMutate(payload);
      } else {
        await createMutate(payload);
      }
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Mutation error:", error);
    }
    resetForm();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutate({ _id: formState._id });
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Delete error:", error);
    }
    resetForm();
  };

  const handleEdit = (widget) => {
    const modifiedWidget = {
      ...widget,
      subscribeTopic: widget.subscribeTopic.split("/")[1],
    };
    setFormState(modifiedWidget);
    setIsEditing(true);
    setIsDeleting(false);
  };

  const handleDeleteStart = (widget) => {
    setFormState(widget);
    setIsDeleting(true);
    setIsEditing(false);
  };

  const handleDeleteCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setFormState({
      _id: "",
      name: "",
      device: "",
      subscribeTopic: "",
      unit: "",
      icon: "",
    });
    setIsEditing(false);
    setIsDeleting(false);
  };

  return (
    <div className="flex flex-row h-screen gap-8 m-2 p-6 bg-gray-900">
      {/* Widgets List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 text-white sticky top-0 bg-gray-900 z-10 py-4">
          Widgets
        </h2>
        <div className="space-y-3 scroll-smooth overflow-y-auto mb-10 pb-4 custom-scrollbar">
          {widgets.map((widget) => {
            const device = devices.find((d) => d._id === widget.device);
            const group = groups.find((g) => g._id === device?.group);
            const SelectedIcon =
              ICON_OPTIONS.find((io) => io.value === widget.icon)?.icon ||
              SunIcon;

            return (
              <div
                key={widget._id}
                className="p-4 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <SelectedIcon className="w-6 h-6 text-indigo-400" />
                      <span className="font-medium text-gray-200">
                        {widget.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400 font-mono">
                      ID: {widget._id}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Device: {device?.name || "Unknown"} | Group:{" "}
                    {group?.name || "Unknown"}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="text-sm text-gray-400">
                      <div>Subscribe: {widget.subscribeTopic}</div>
                      <div>Publish: {widget.publishTopic || "N/A"}</div>
                    </div>
                    <div className="text-sm text-gray-400">
                      <div>Unit: {widget.unit}</div>
                      <div>Icon: {widget.icon}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(widget)}
                    className="text-indigo-400 hover:text-indigo-300 p-1 rounded-md hover:bg-gray-600"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteStart(widget)}
                    className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-gray-600"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form / Delete Confirmation */}
      <div className="w-96 sticky top-6 h-fit">
        <div className="bg-gray-800 p-6 border border-gray-700 rounded-lg shadow-lg">
          {isDeleting ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold mb-4 text-white">
                Delete Widget
              </h2>
              <p className="text-gray-300">
                Are you sure you want to delete{" "}
                <span className="font-semibold">"{formState.name}"</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex-1 transition-colors"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={handleDeleteCancel}
                  className="bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-bold mb-4 text-white">
                {isEditing ? "Edit Widget" : "Add New Widget"}
              </h2>
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400 ">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                  />
                </div>

                {/* Device Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400 ">
                    Device
                  </label>
                  <select
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formState.device}
                    onChange={(e) =>
                      setFormState({ ...formState, device: e.target.value })
                    }
                  >
                    <option value="">Select Device</option>
                    {devices.map((device) => (
                      <option key={device._id} value={device._id}>
                        {device.name} (
                        {groups.find((g) => g._id === device.group)?.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subscribe Topic Field */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    Subscribe Topic
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formState.subscribeTopic}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        subscribeTopic: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Unit Field */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    Unit
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formState.unit}
                    onChange={(e) =>
                      setFormState({ ...formState, unit: e.target.value })
                    }
                  />
                </div>

                {/* Icon Dropdown using CustomIconSelect */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    Icon
                  </label>
                  <CustomIconSelect
                    value={formState.icon}
                    onChange={(val) =>
                      setFormState({ ...formState, icon: val })
                    }
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex-1 transition-colors"
                      >
                        {editLoading ? "Updating..." : "Update"}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full transition-colors"
                    >
                      {createLoading ? "Adding..." : "Add Widget"}
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
