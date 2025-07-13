"use client";

import { Payment, PaymentStatus } from "@/lib/type";
import axios, { isAxiosError } from "axios";
import React, { useState, useEffect } from "react";

const OrderList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("/api/payment"); // Ganti dengan endpoint API yang sesuai
      const data = response.data;
      setPayments(data);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Terjadi kesalahan saat mengambil data pembayaran");
      }
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi pembantu untuk menentukan kelas status badge
  const getStatusBadgeClasses = (status: PaymentStatus) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700"; // Hijau untuk Completed
      case "pending":
        return "bg-yellow-100 text-yellow-700"; // Kuning untuk Pending
      case "cancelled":
        return "bg-red-100 text-red-700"; // Merah untuk Cancelled
      case "failed":
        return "bg-red-200 text-red-800"; // Merah untuk Failed
      default:
        return "bg-gray-100 text-gray-700"; // Default
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 max-w-4xl bg-white rounded-lg shadow-md text-center text-lg text-gray-700">Memuat daftar pesanan...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 max-w-4xl bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl bg-white rounded-lg shadow-lg my-8">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Daftar Pesanan</h2>
      {payments.length === 0 ? (
        <p className="text-center text-gray-600">Tidak ada pesanan yang tersedia.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pembayaran</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pengguna</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pesanan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat Pada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat Oleh</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment: Payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{payment.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(payment.status)}`}>{payment.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.CreatedBy || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
