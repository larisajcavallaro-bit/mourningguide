import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Issues a short-lived client upload token for private documents (wills,
// trusts, IDs). Unlike photos, these are never public — the file requires
// server-side authentication to read (see [id]/download route).
export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request: req,
      token: process.env.DOCUMENTS_BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async () => {
        const { userId } = await auth();
        if (!userId) throw new Error('Unauthorized');
        return {
          allowedContentTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/heic'],
          maximumSizeInBytes: 25 * 1024 * 1024, // 25MB per document
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => { /* record is created by the client via POST /api/vault/documents */ },
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
