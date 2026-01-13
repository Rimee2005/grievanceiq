'use client';

import { useState } from 'react';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
  allowDownload?: boolean;
}

export default function ImageModal({ imageUrl, onClose, allowDownload = false }: ImageModalProps) {
  const [zoom, setZoom] = useState(1);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `complaint-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Image Preview</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={zoom <= 0.5}
            >
              −
            </button>
            <span className="text-sm text-gray-600 w-16 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={zoom >= 3}
            >
              +
            </button>
            <button
              onClick={handleResetZoom}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              Reset
            </button>
            {allowDownload && (
              <button
                onClick={handleDownload}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Download
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
          <img
            src={imageUrl}
            alt="Complaint Evidence"
            className="max-w-full max-h-full object-contain transition-transform"
            style={{ transform: `scale(${zoom})` }}
            onError={(e) => {
              console.error('[ImageModal] Failed to load image:', imageUrl);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              // Show error message
              const container = target.parentElement;
              if (container) {
                container.innerHTML = `
                  <div class="text-center p-8">
                    <p class="text-red-600 font-semibold mb-2">⚠️ Failed to Load Image</p>
                    <p class="text-gray-600 text-sm">The image URL may be invalid or the image has been removed.</p>
                    <p class="text-gray-500 text-xs mt-2">URL: ${imageUrl.substring(0, 100)}...</p>
                  </div>
                `;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

