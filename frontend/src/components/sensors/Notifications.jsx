import React, { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { devicesAtom, groupsAtom } from '../../store/gdAtoms';
import { elementRefreshAtom } from '../../store/elementAtoms';
import { notificationSensorsAtom } from '../../store/sensorAtoms';
import { elementsAtom } from '../../store/elementAtoms'; 
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { createNotification, editNotification, deleteElements } from '../../services/api/endpoints';
import { useApiMutation } from '../../hooks/mutationHook';

export const Notifications = () => {
  const notifications = useRecoilValue(notificationSensorsAtom);
  const devices = useRecoilValue(devicesAtom);
  const groups = useRecoilValue(groupsAtom);
  const allElements = useRecoilValue(elementsAtom);
  const setRefresh = useSetRecoilState(elementRefreshAtom);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formState, setFormState] = useState({ 
    _id: '', 
    name: '', 
    device: '',
    subscribeTopic: '',
    element: '',
    email: '',
    message: '',
    condition: ''
  });

  const { mutate: createMutate, loading: createLoading } = useApiMutation(createNotification);
  const { mutate: editMutate, loading: editLoading } = useApiMutation(editNotification);
  const { mutate: deleteMutate, loading: deleteLoading } = useApiMutation(deleteElements);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formState };
      
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

  const handleEdit = (notification) => {
    const modifiedNotification = { 
      ...notification,
      subscribeTopic: notification.subscribeTopic.split("/")[1]
    };
    setFormState(modifiedNotification);
    setIsEditing(true);
    setIsDeleting(false);
  };

  const handleDeleteStart = (notification) => {
    setFormState(notification);
    setIsDeleting(true);
    setIsEditing(false);
  };

  const handleDeleteCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setFormState({ 
      _id: '', 
      name: '', 
      device: '',
      subscribeTopic: '',
      element: '',
      email: '',
      message: '',
      condition: ''
    });
    setIsEditing(false);
    setIsDeleting(false);
  };

  return (
    <div className="flex flex-row h-screen gap-8 m-2 p-6 bg-gray-900">
      {/* Notifications List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 text-gray-100 dark:text-white sticky top-0 bg-gray-900 z-10 py-4">
          Notifications
        </h2>
        <div className="space-y-3 scroll-smooth overflow-y-auto mb-10 pb-4 custom-scrollbar">
          {notifications.map(notification => {
            const device = devices.find(d => d._id === notification.device);
            const group = groups.find(g => g._id === device?.group);
            // Look up the element selected in the notification
            const selectedElement = allElements.find(el => el._id === notification.element);
            return (
              <div 
                key={notification._id}
                className="p-4 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-200">{notification.name}</span>
                    <span className="text-sm text-gray-400 font-mono">ID: {notification._id}</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Device: {device?.name || 'Unknown'} | Group: {group?.name || 'Unknown'}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="text-sm text-gray-400">
                      <div>Subscribe: {notification.subscribeTopic}</div>
                      <div>Publish: {notification.publishTopic || 'N/A'}</div>
                      <div>Element: {selectedElement ? selectedElement.name : 'N/A'}</div>
                    </div>
                    <div className="text-sm text-gray-400">
                      <div>Email: {notification.email}</div>
                      <div>Message: {notification.message}</div>
                      <div>Condition: {notification.condition}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(notification)}
                    className="text-indigo-400 hover:text-indigo-300 p-1 rounded-md hover:bg-gray-600"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteStart(notification)}
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
      <div className="w-96 h-screen overflow-y-auto custom-scrollbar mb-10 pb-10  ">
        <div className="bg-gray-800 m-6 p-6 border border-gray-700 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-100 dark:text-white">
            {isEditing ? 'Edit Notification' : isDeleting ? 'Delete Notification' : 'Add New Notification'}
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
                  <label className="block text-sm font-medium mb-1 text-gray-400">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">Device</label>
                  <select
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formState.device}
                    onChange={e => setFormState({ ...formState, device: e.target.value })}
                  >
                    <option value="">Select Device</option>
                    {devices.map(device => (
                      <option key={device._id} value={device._id}>
                        {device.name} ({groups.find(g => g._id === device.group)?.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">Subscribe Topic</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formState.subscribeTopic}
                    onChange={e => setFormState({ ...formState, subscribeTopic: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">Element</label>
                  <select
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formState.element}
                    onChange={e => setFormState({ ...formState, element: e.target.value })}
                  >
                    <option value="">Select Element</option>
                    {allElements.map(el => (
                      <option key={el._id} value={el._id}>
                        {el.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formState.email}
                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">Message</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formState.message}
                    onChange={e => setFormState({ ...formState, message: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">Condition</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. > 25"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formState.condition}
                    onChange={e => setFormState({ ...formState, condition: e.target.value })}
                  />
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
                      {createLoading ? 'Adding...' : 'Add Notification'}
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
