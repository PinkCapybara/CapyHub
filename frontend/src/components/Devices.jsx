import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { groupsAtom } from '../store/gdAtoms';
import { devicesAtom, devicesRefreshAtom } from '../store/gdAtoms';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { createDevice, editDevice, deleteDevice } from '../services/api/endpoints';
import { useApiMutation } from '../hooks/mutationHook';
import '../App.css'

export const Devices = () => {
  const devices = useRecoilValue(devicesAtom);
  const groups = useRecoilValue(groupsAtom);
  const setRefresh = useSetRecoilState(devicesRefreshAtom);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formState, setFormState] = useState({ 
    _id: '', 
    name: '', 
    group: '' 
  });

  const { mutate: createMutate, loading: createLoading } = useApiMutation(createDevice);
  const { mutate: editMutate, loading: editLoading } = useApiMutation(editDevice);
  const { mutate: deleteMutate, loading: deleteLoading } = useApiMutation(deleteDevice);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formState.name,
        group: formState.group,
        ...(isEditing && { _id: formState._id })
      };

      if (isEditing) {
        await editMutate(payload);
      } else {
        await createMutate(payload);
      }
      setRefresh(prev => prev + 1);
    } catch (error) {
      console.error('Mutation error:', error);
    }
    resetForm();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutate({ _id: formState._id });
      setRefresh(prev => prev + 1);
    } catch (error) {
      console.error('Delete error:', error);
    }
    resetForm();
  };

  const handleEdit = (device) => {
    setFormState(device);
    setIsEditing(true);
    setIsDeleting(false);
  };

  const handleDeleteStart = (device) => {
    setFormState(device);
    setIsDeleting(true);
    setIsEditing(false);
  };

  const handleDeleteCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setFormState({ _id: '', name: '', group: '' });
    setIsEditing(false);
    setIsDeleting(false);
  };

  return (
    <div className="flex flex-row h-screen gap-8 m-2 p-6 bg-gray-900">
      {/* Devices List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 text-gray-100 sticky top-0 bg-gray-900 z-10 py-4 dark:text-white">
          Devices List
        </h2>
        <div className="space-y-3 custom-scrollbar scroll-smooth overflow-y-auto mb-10 pb-4">
          {devices.map(device => (
            <div 
              key={device._id}
              className="p-4 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 flex justify-between items-center transition-colors"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-200">{device.name}</span>
                <span className="text-sm text-gray-400">
                  Group: {groups.find(g => g._id === device.group)?.name || 'Unknown'}
                </span>
                <span className="text-sm text-gray-400 font-mono">ID: {device._id}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(device)}
                  className="text-indigo-400 hover:text-indigo-300 p-1 rounded-md hover:bg-gray-600"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteStart(device)}
                  className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-gray-600"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form / Delete Confirmation */}
      <div className="w-96 sticky top-6 h-fit">
        <div className="bg-gray-800 p-6 border border-gray-700 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-100 dark:text-white">
            {isEditing ? 'Edit Device' : isDeleting ? 'Delete Device' : 'Add New Device'}
          </h2>

          {isDeleting ? (
            <div className="space-y-6">
              <p className="text-gray-300">
                Are you sure you want to delete <span className="font-semibold">"{formState.name}"</span>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteConfirm}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex-1 transition-colors"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
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
                    Device Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 dark:text-white
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    Group
                  </label>
                  <select
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 dark:text-white
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formState.group}
                    onChange={e => setFormState({ ...formState, group: e.target.value })}
                  >
                    <option value="">Select Group</option>
                    {groups.map(group => (
                      <option key={group._id} value={group._id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex-1 transition-colors"
                      >
                        {editLoading ? 'Updating...' : 'Update'}
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
                      {createLoading ? 'Adding...' : 'Add Device'}
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