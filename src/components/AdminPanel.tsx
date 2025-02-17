import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Submission {
  _id: string;
  name: string;
  email: string;
  phone: string;
  hearAboutUs: string;
  goal: string;
  budget: string;
  technicalInfo: string;
  createdAt: string;
}

const AdminPanel = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/submissions');
      setSubmissions(response.data);
    } catch (error) {
      toast.error('Failed to fetch submissions');
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await axios.delete(`http://localhost:5000/api/submissions/${id}`);
        toast.success('Submission deleted successfully');
        fetchSubmissions();
      } catch (error) {
        toast.error('Failed to delete submission');
      }
    }
  };

  const handleEdit = (submission: Submission) => {
    setEditingSubmission(submission);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubmission) return;

    try {
      await axios.put(
        `http://localhost:5000/api/submissions/${editingSubmission._id}`,
        editingSubmission
      );
      toast.success('Submission updated successfully');
      setEditingSubmission(null);
      fetchSubmissions();
    } catch (error) {
      toast.error('Failed to update submission');
    }
  };

  const columnHelper = createColumnHelper<Submission>();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('hearAboutUs', {
      header: 'Heard From',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('goal', {
      header: 'Goal',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('budget', {
      header: 'Budget',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Submitted At',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(info.row.original)}
            className="p-1 text-blue-600 hover:text-blue-800"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(info.row.original._id)}
            className="p-1 text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: submissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Form Submissions</h1>
      
      {editingSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Edit Submission</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              {Object.entries(editingSubmission).map(([key, value]) => {
                if (key === '_id' || key === 'createdAt') return null;
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setEditingSubmission({
                          ...editingSubmission,
                          [key]: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                );
              })}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSubmission(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <th>No</th>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.index + 1}
                </td>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;