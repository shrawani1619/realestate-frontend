'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useConfirm } from '@/context/ConfirmContext';
import { api } from '@/lib/api';
import { Layout, Plot } from '@/lib/types';
import { notify } from '@/lib/notify';
import { getLayoutImages, getPrimaryLayoutImage, MAX_LAYOUT_IMAGES } from '@/lib/layoutImages';

const emptyLayout = {
  name: '',
  description: '',
  location: '',
  lat: '',
  lng: '',
  status: 'active' as 'active' | 'inactive',
};

const emptyPlot = {
  plotNumber: '',
  size: '',
  price: '',
  facing: 'North' as 'North' | 'South' | 'East' | 'West',
  status: 'available' as 'available' | 'booked' | 'sold',
  description: '',
  coordinates: { x: 10, y: 10 },
};

export default function AdminLayoutsPage() {
  const { token } = useAuth();
  const confirm = useConfirm();
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [showLayoutForm, setShowLayoutForm] = useState(false);
  const [showPlotForm, setShowPlotForm] = useState(false);
  const [layoutForm, setLayoutForm] = useState(emptyLayout);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [savingLayout, setSavingLayout] = useState(false);
  const [plotForm, setPlotForm] = useState(emptyPlot);
  const [editingLayout, setEditingLayout] = useState<string | null>(null);

  const fetchLayouts = () => {
    if (!token) return;
    api.get<Layout[]>('/layouts/admin/all', token).then(setLayouts).catch(() => {});
  };

  const fetchPlots = (layoutId: string) => {
    api.get<Plot[]>(`/plots?layoutId=${layoutId}`).then(setPlots).catch(() => {});
  };

  useEffect(() => {
    if (token) fetchLayouts();
  }, [token]);

  useEffect(() => {
    if (selectedLayout) fetchPlots(selectedLayout);
  }, [selectedLayout]);

  const buildLayoutFormData = () => {
    const formData = new FormData();
    formData.append('name', layoutForm.name);
    formData.append('description', layoutForm.description);
    formData.append('location', layoutForm.location);
    formData.append('status', layoutForm.status);
    if (layoutForm.lat) formData.append('lat', layoutForm.lat);
    if (layoutForm.lng) formData.append('lng', layoutForm.lng);
    if (editingLayout) {
      formData.append('keepImages', JSON.stringify(existingImages));
    }
    newImages.forEach((file) => formData.append('images', file));
    return formData;
  };

  const clearNewImagePreviews = () => {
    newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setNewImages([]);
    setNewImagePreviews([]);
  };

  const resetLayoutForm = () => {
    setShowLayoutForm(false);
    setLayoutForm(emptyLayout);
    clearNewImagePreviews();
    setExistingImages([]);
    setEditingLayout(null);
  };

  const addLayoutImages = (files: FileList | null) => {
    if (!files?.length) return;

    const selected = Array.from(files);
    const total = existingImages.length + newImages.length + selected.length;

    if (total > MAX_LAYOUT_IMAGES) {
      notify.error(`You can add up to ${MAX_LAYOUT_IMAGES} images per layout`);
      return;
    }

    setNewImages((prev) => [...prev, ...selected]);
    setNewImagePreviews((prev) => [
      ...prev,
      ...selected.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const saveLayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingLayout(true);
    const formData = buildLayoutFormData();

    try {
      if (editingLayout) {
        await api.putForm<Layout>(`/layouts/${editingLayout}`, formData, token);
        notify.success('Layout updated');
      } else {
        await api.postForm<Layout>('/layouts', formData, token);
        notify.success('Layout created');
      }
      resetLayoutForm();
      fetchLayouts();
    } catch (err: unknown) {
      const error = err as { message?: string };
      notify.error(error.message || 'Failed');
    } finally {
      setSavingLayout(false);
    }
  };

  const savePlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedLayout) return;
    try {
      await api.post(
        '/plots',
        { ...plotForm, layoutId: selectedLayout, price: Number(plotForm.price) },
        token
      );
      notify.success('Plot added');
      setShowPlotForm(false);
      setPlotForm(emptyPlot);
      fetchPlots(selectedLayout);
    } catch (err: unknown) {
      const error = err as { message?: string };
      notify.error(error.message || 'Failed');
    }
  };

  const deleteLayout = async (id: string) => {
    if (!token) return;
    const confirmed = await confirm({
      title: 'Delete layout',
      message: 'Delete this layout and all its plots?',
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!confirmed) return;
    await api.delete(`/layouts/${id}`, token);
    notify.success('Layout deleted');
    if (selectedLayout === id) setSelectedLayout(null);
    fetchLayouts();
  };

  const updatePlotStatus = async (plotId: string, status: string, currentStatus: string) => {
    if (!token) return;

    const needsConfirm = status === 'sold' || currentStatus === 'sold';
    if (needsConfirm) {
      const confirmed = await confirm({
        title: 'Update plot status',
        message:
          currentStatus === 'sold'
            ? 'Change status away from SOLD? Admin confirmation is required.'
            : 'Mark this plot as SOLD? Admin confirmation is required.',
        confirmLabel: 'Confirm',
      });
      if (!confirmed) return;
    }

    try {
      await api.patch(
        `/plots/${plotId}/status`,
        { status, confirmSold: needsConfirm || undefined },
        token
      );
      notify.success('Plot status updated');
      if (selectedLayout) fetchPlots(selectedLayout);
    } catch (err: unknown) {
      const error = err as { message?: string };
      notify.error(error.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Layout & Plot Management</h2>
          <p className="mt-1 text-sm text-gray-500">Create layouts and manage plots</p>
        </div>
        <button
          onClick={() => {
            setShowLayoutForm(true);
            setEditingLayout(null);
            setLayoutForm(emptyLayout);
            clearNewImagePreviews();
            setExistingImages([]);
          }}
          className="btn-primary"
        >
          Add Layout
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="card">
          <h2 className="font-semibold">Layouts</h2>
          <div className="mt-4 space-y-2">
            {layouts.map((l) => (
              <div
                key={l._id}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  selectedLayout === l._id ? 'border-primary-500 bg-primary-50' : ''
                }`}
              >
                <button onClick={() => setSelectedLayout(l._id)} className="text-left">
                  <p className="font-medium">{l.name}</p>
                  <p className="text-xs text-gray-500">{l.location}</p>
                  {l.plotStats && (
                    <p className="text-xs text-gray-400">
                      {l.plotStats.available} available · {l.plotStats.total} total
                    </p>
                  )}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingLayout(l._id);
                      setLayoutForm({
                        name: l.name,
                        description: l.description,
                        location: l.location,
                        lat: l.coordinates?.lat?.toString() || '',
                        lng: l.coordinates?.lng?.toString() || '',
                        status: l.status,
                      });
                      clearNewImagePreviews();
                      setExistingImages(getLayoutImages(l));
                      setShowLayoutForm(true);
                    }}
                    className="text-xs text-primary-600"
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteLayout(l._id)} className="text-xs text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Plots</h2>
            {selectedLayout && (
              <button onClick={() => setShowPlotForm(true)} className="btn-primary text-xs">
                Add Plot
              </button>
            )}
          </div>
          {!selectedLayout ? (
            <p className="mt-4 text-sm text-gray-400">Select a layout to manage plots</p>
          ) : plots.length === 0 ? (
            <p className="mt-4 text-sm text-gray-400">No plots yet</p>
          ) : (
            <div className="mt-4 space-y-2">
              {plots.map((p) => (
                <div key={p._id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <div>
                    <p className="font-medium">Plot {p.plotNumber}</p>
                    <p className="text-gray-500">
                      {p.size} · ₹{p.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={p.status}
                      onChange={(e) => updatePlotStatus(p._id, e.target.value, p.status)}
                      className="rounded border px-2 py-1 text-xs"
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="sold">Sold</option>
                    </select>
                    {p.status !== 'booked' && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (!token) return;
                          const confirmed = await confirm({
                            title: 'Delete plot',
                            message: `Delete plot ${p.plotNumber}?`,
                            confirmLabel: 'Delete',
                            variant: 'danger',
                          });
                          if (!confirmed) return;
                          try {
                            await api.delete(`/plots/${p._id}`, token);
                            notify.success('Plot deleted');
                            if (selectedLayout) fetchPlots(selectedLayout);
                            fetchLayouts();
                          } catch (err: unknown) {
                            const error = err as { message?: string };
                            notify.error(error.message || 'Cannot delete plot');
                          }
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showLayoutForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={saveLayout} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">
            <h2 className="text-lg font-semibold">{editingLayout ? 'Edit' : 'Add'} Layout</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium">Name</label>
                <input
                  className="input-field"
                  value={layoutForm.name}
                  onChange={(e) => setLayoutForm({ ...layoutForm, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Location</label>
                <input
                  className="input-field"
                  value={layoutForm.location}
                  onChange={(e) => setLayoutForm({ ...layoutForm, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Description</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={layoutForm.description}
                  onChange={(e) => setLayoutForm({ ...layoutForm, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Latitude</label>
                  <input
                    className="input-field"
                    value={layoutForm.lat}
                    onChange={(e) => setLayoutForm({ ...layoutForm, lat: e.target.value })}
                    placeholder="18.5912"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Longitude</label>
                  <input
                    className="input-field"
                    value={layoutForm.lng}
                    onChange={(e) => setLayoutForm({ ...layoutForm, lng: e.target.value })}
                    placeholder="73.7389"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Status</label>
                <select
                  className="input-field"
                  value={layoutForm.status}
                  onChange={(e) =>
                    setLayoutForm({
                      ...layoutForm,
                      status: e.target.value as 'active' | 'inactive',
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Layout Images</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="input-field"
                  onChange={(e) => {
                    addLayoutImages(e.target.files);
                    e.target.value = '';
                  }}
                />
                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG, or WEBP · max 5MB each · up to {MAX_LAYOUT_IMAGES} images
                </p>
                {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {existingImages.map((src, index) => (
                      <div key={`existing-${src}-${index}`} className="relative">
                        <img
                          src={src}
                          alt={`Layout ${index + 1}`}
                          className="h-24 w-full rounded-lg border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {newImagePreviews.map((src, index) => (
                      <div key={`new-${src}`} className="relative">
                        <img
                          src={src}
                          alt={`New layout ${index + 1}`}
                          className="h-24 w-full rounded-lg border object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={resetLayoutForm} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={savingLayout} className="btn-primary flex-1">
                {savingLayout ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {showPlotForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={savePlot} className="w-full max-w-md rounded-xl bg-white p-6">
            <h2 className="text-lg font-semibold">Add Plot</h2>
            <div className="mt-4 space-y-3">
              <input className="input-field" placeholder="Plot Number" value={plotForm.plotNumber}
                onChange={(e) => setPlotForm({ ...plotForm, plotNumber: e.target.value })} required />
              <input className="input-field" placeholder="Size (e.g. 30x40)" value={plotForm.size}
                onChange={(e) => setPlotForm({ ...plotForm, size: e.target.value })} required />
              <input className="input-field" type="number" placeholder="Price" value={plotForm.price}
                onChange={(e) => setPlotForm({ ...plotForm, price: e.target.value })} required />
              <select
                className="input-field"
                value={plotForm.facing}
                onChange={(e) =>
                  setPlotForm({
                    ...plotForm,
                    facing: e.target.value as 'North' | 'South' | 'East' | 'West',
                  })
                }
              >
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
              </select>
              <input className="input-field" placeholder="Description" value={plotForm.description}
                onChange={(e) => setPlotForm({ ...plotForm, description: e.target.value })} />
              <p className="text-xs text-gray-500">Map position on layout image (%)</p>
              <div className="grid grid-cols-2 gap-2">
                {(['x', 'y'] as const).map((k) => (
                  <input key={k} type="number" className="input-field" placeholder={k}
                    value={plotForm.coordinates[k]}
                    onChange={(e) =>
                      setPlotForm({
                        ...plotForm,
                        coordinates: { ...plotForm.coordinates, [k]: Number(e.target.value) },
                      })
                    }
                  />
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setShowPlotForm(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1">Add Plot</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
