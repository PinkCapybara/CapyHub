import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { devicesAtom, groupsAtom } from "../../store/gdAtoms";
import { elementRefreshAtom } from "../../store/elementAtoms";
import { gaugeSensorsAtom } from "../../store/sensorAtoms";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  createGauge,
  editGauge,
  deleteElements,
} from "../../services/api/endpoints";
import { useApiMutation } from "../../hooks/mutationHook";

export const Gauges = () => {
  const gauges = useRecoilValue(gaugeSensorsAtom);
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
    minValue: "",
    maxValue: "",
  });

  const { mutate: createMutate, loading: createLoading } =
    useApiMutation(createGauge);
  const { mutate: editMutate, loading: editLoading } =
    useApiMutation(editGauge);
  const { mutate: deleteMutate, loading: deleteLoading } =
    useApiMutation(deleteElements);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formState,
        minValue: Number(formState.minValue),
        maxValue: Number(formState.maxValue),
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

  const handleEdit = (gauge) => {
    const modifiedGauge = {
      ...gauge,
      subscribeTopic: gauge.subscribeTopic.split("/")[1],
    };
    setFormState(modifiedGauge);
    setIsEditing(true);
    setIsDeleting(false);
  };

  const handleDeleteStart = (gauge) => {
    setFormState(gauge);
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
      minValue: "",
      maxValue: "",
    });
    setIsEditing(false);
    setIsDeleting(false);
  };

  return (
    <div className="flex flex-row h-screen gap-8 m-2 p-6 bg-gray-900">
      {/* Gauges List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 text-white sticky top-0 bg-gray-900 z-10 py-4">
          Gauges
        </h2>
        <div className="space-y-3 scroll-smooth overflow-y-auto mb-10 pb-4 custom-scrollbar">
          {gauges.map((gauge) => {
            const device = devices.find((d) => d._id === gauge.device);
            const group = groups.find((g) => g._id === device?.group);

            return (
              <div
                key={gauge._id}
                className="p-4 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-200">
                      {gauge.name}
                    </span>
                    <span className="text-sm text-gray-400 font-mono">
                      ID: {gauge._id}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Device: {device?.name || "Unknown"} | Group:{" "}
                    {group?.name || "Unknown"}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="text-sm text-gray-400">
                      <div>Subscribe: {gauge.subscribeTopic}</div>
                      <div>Publish: {gauge.publishTopic || "N/A"}</div>
                    </div>
                    <div className="text-sm text-gray-400">
                      <div>Min: {gauge.minValue}</div>
                      <div>Max: {gauge.maxValue}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(gauge)}
                    className="text-indigo-400 hover:text-indigo-300 p-1 rounded-md hover:bg-gray-600"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteStart(gauge)}
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
          <h2 className="text-xl font-bold mb-4 text-white">
            {isEditing
              ? "Edit Gauge"
              : isDeleting
                ? "Delete Gauge"
                : "Add New Gauge"}
          </h2>

          {isDeleting ? (
            <div className="space-y-6">
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">
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

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">
                      Min Value
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={formState.minValue}
                      onChange={(e) =>
                        setFormState({ ...formState, minValue: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">
                      Max Value
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={formState.maxValue}
                      onChange={(e) =>
                        setFormState({ ...formState, maxValue: e.target.value })
                      }
                    />
                  </div>
                </div>

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
                      {createLoading ? "Adding..." : "Add Gauge"}
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
