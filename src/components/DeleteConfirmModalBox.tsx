import React from "react";

const DeleteConfirmModalBox = ({ isOpen, onClose, onConfirm, itemName, children }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; itemName: string; children?: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center relative animate-fade-in-up">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-semibold" aria-label="Close">
          &times;
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h2>

        {/* Modal Body: Menggunakan children di sini */}
        {children ? (
          <div className="text-gray-600 mb-6">{children}</div>
        ) : (
          <p className="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus <span className="font-semibold">{itemName}</span>? Tindakan ini tidak dapat dibatalkan.
          </p>
        )}

        {/* Modal Buttons */}
        <div className="flex justify-center space-x-4">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">
            Batal
          </button>
          <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModalBox;
