import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { groupsAtom, groupsRefreshAtom } from "../store/gdAtoms";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { createGroup, editGroup, deleteGroup } from "../services/api/endpoints";
import { useApiMutation } from "../hooks/mutationHook";
import "../App.css";

export const Groups = () => {
  const groups = useRecoilValue(groupsAtom);
  const setRefresh = useSetRecoilState(groupsRefreshAtom);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formState, setFormState] = useState({ _id: "", name: "" });

  const { mutate: createMutate, loading: createLoading } =
    useApiMutation(createGroup);
  const { mutate: editMutate, loading: editLoading } =
    useApiMutation(editGroup);
  const { mutate: deleteMutate, loading: deleteLoading } =
    useApiMutation(deleteGroup);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await editMutate(formState);
      } else {
        await createMutate({ name: formState.name });
      }
      // Trigger a refresh so that groupsAtom re-fetches data.
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Mutation error:", error);
    }
    resetForm();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutate(formState);
      // Trigger a refresh after deletion.
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Delete error:", error);
    }
    resetForm();
  };

  const handleEdit = (group) => {
    setFormState(group);
    setIsEditing(true);
    setIsDeleting(false);
  };

  const handleDeleteStart = (group) => {
    setFormState(group);
    setIsDeleting(true);
    setIsEditing(false);
  };

  const handleDeleteCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setFormState({ _id: "", name: "" });
    setIsEditing(false);
    setIsDeleting(false);
  };

  return (
    <div className="flex flex-row h-screen gap-8 m-2 p-6 bg-gray-900">
      {/* Groups List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 sticky top-0 bg-gray-900 z-10 py-4 text-white">
          Groups List
        </h2>
        <div className="space-y-3 custom-scrollbar scroll-smooth overflow-y-auto mb-10 pb-4">
          {groups.map((group) => (
            <div
              key={group._id}
              className="p-4 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 flex justify-between items-center transition-colors"
            >
              <span className="font-medium text-gray-200">{group.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(group)}
                  className="text-indigo-400 hover:text-indigo-300 p-1 rounded-md hover:bg-gray-600"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteStart(group)}
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
          <h2 className="text-xl font-bold mb-4 text-white">
            {isEditing
              ? "Edit Group"
              : isDeleting
                ? "Delete Group"
                : "Add New Group"}
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
                    Group Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white
                             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                  />
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
                      {createLoading ? "Adding..." : "Add Group"}
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
