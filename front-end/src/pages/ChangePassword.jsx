import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, resetAuthState } from "../redux/authSlice";
import toast, { Toaster } from "react-hot-toast";

const ChangePasswordModal = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    dispatch(changePassword({ currentPassword: formData.currentPassword, newPassword: formData.newPassword }));
  };

  const closeModal = () => {
    setIsOpen(false);
    dispatch(resetAuthState());
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  useEffect(() => {
    if (success) {
      toast.success("Password changed successfully!");
      closeModal();
    } else if (error) {
      toast.error(error.message || error.error || "Something went wrong.");
    }
  }, [success, error]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Change Password
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-transparent backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full px-4 py-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
                  <Dialog.Title className="text-lg font-semibold text-gray-800">
                    Change Password
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Current Password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                      required
                    />

                    <input
                      type="password"
                      name="newPassword"
                      placeholder="New Password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                      required
                    />

                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm New Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                      required
                    />

                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                      >
                        {loading ? "Updating..." : "Submit"}
                      </button>
                      <button
                        type="button"
                        className="text-gray-500 hover:underline"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ChangePasswordModal;
