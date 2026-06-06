'use client';

import { useCallback, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { notify } from '@/lib/notify';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!token) return;
      if (!file.type.startsWith('image/')) {
        notify.warning('Please upload an image file');
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', file);
        const result = await api.postForm<{ imageUrl: string }>('/cms/upload', formData, token);
        onChange(result.imageUrl);
        notify.success('Image uploaded');
      } catch (err: unknown) {
        const error = err as { message?: string };
        notify.error(error.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [token, onChange]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed p-4 transition ${
          dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50'
        }`}
      >
        {value ? (
          <div className="space-y-3">
            <img src={value} alt="Preview" className="max-h-40 w-full rounded-lg object-cover" />
            <div className="flex flex-wrap gap-2">
              <label className="btn-secondary cursor-pointer text-xs">
                Replace
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadFile(file);
                  }}
                />
              </label>
              <button type="button" onClick={() => onChange('')} className="btn-danger text-xs">
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-500">Drag & drop an image here, or click to browse</p>
            <label className="btn-secondary mt-3 inline-flex cursor-pointer text-xs">
              {uploading ? 'Uploading...' : 'Choose Image'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadFile(file);
                }}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
