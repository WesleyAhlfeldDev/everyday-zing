import { NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';
import { getSession } from '@/app/lib/auth';

// Issues short-lived tokens so the browser can upload straight to Vercel Blob,
// avoiding the 4.5 MB request limit on Vercel functions.
export async function POST(request) {
  const body = await request.json();

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async () => {
        if (!(await getSession())) throw new Error('Unauthorized');
        return {
          allowedContentTypes: ['image/*', 'video/mp4', 'video/webm', 'application/pdf'],
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
