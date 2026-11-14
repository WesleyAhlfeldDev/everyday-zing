'use client';

import { useState } from 'react';
import { upload } from '@vercel/blob/client';
import { recordMedia } from '../actions';

// Uploads files straight from the browser to Vercel Blob, then records them
// in the media library. Returns the saved media rows.
export function useUpload() {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

  async function uploadFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return [];
    setError(null);
    const saved = [];

    try {
      for (const [i, file] of files.entries()) {
        const blob = await upload(`uploads/${file.name}`, file, {
          access: 'public',
          handleUploadUrl: '/api/admin/upload',
          onUploadProgress: ({ percentage }) =>
            setProgress({ file: file.name, index: i + 1, total: files.length, percentage }),
        });
        const res = await recordMedia({
          url: blob.url,
          pathname: blob.pathname,
          contentType: blob.contentType || file.type,
          size: file.size,
          filename: file.name,
        });
        if (res?.error) throw new Error(res.error);
        if (res.item) saved.push(res.item);
      }
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setProgress(null);
    }
    return saved;
  }

  return { uploadFiles, progress, error };
}
