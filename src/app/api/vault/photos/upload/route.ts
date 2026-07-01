import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Issues a short-lived client upload token so the browser can upload directly
// to Vercel Blob (bypassing the 4.5MB serverless body limit). Auth-gated.
export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        const { userId } = await auth();
        if (!userId) throw new Error('Unauthorized');
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif'],
          maximumSizeInBytes: 15 * 1024 * 1024, // 15MB per photo
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => { /* record is created by the client via POST /api/vault/photos */ },
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
