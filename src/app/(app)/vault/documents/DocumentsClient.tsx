'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';

type Doc = { id: string; storageKey: string; fileName: string; category: string | null; notes: string | null };

const CATEGORIES = [
  { value: 'will', label: 'Will' },
  { value: 'trust', label: 'Trust' },
  { value: 'id', label: 'ID / passport' },
  { value: 'insurance', label: 'Insurance policy' },
  { value: 'property', label: 'Property deed' },
  { value: 'other', label: 'Other' },
];

export default function DocumentsClient({ initial }: { initial: Doc[] }) {
  const [docs, setDocs] = useState<Doc[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setUploadError('');
    try {
      for (const file of files) {
        const blob = await upload(file.name, file, {
          access: 'private',
          handleUploadUrl: '/api/vault/documents/upload',
        });
        const res = await fetch('/api/vault/documents', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: blob.url, fileName: file.name }),
        });
        if (res.ok) {
          const { item } = await res.json();
          setDocs(prev => [...prev, item]);
        }
      }
    } catch {
      setUploadError('Some files couldn\'t be uploaded. Please try again.');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function saveMeta(id: string, patch: Partial<Pick<Doc, 'category' | 'notes'>>) {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d));
    const doc = docs.find(d => d.id === id);
    fetch(`/api/vault/documents/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: patch.category ?? doc?.category ?? '', notes: patch.notes ?? doc?.notes ?? '' }),
    }).catch(() => {});
  }

  async function download(doc: Doc) {
    setDownloadingId(doc.id);
    try {
      const res = await fetch(`/api/vault/documents/${doc.id}/download`);
      if (!res.ok) { alert('Could not download this file. Please try again.'); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = doc.fileName;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this document? This cannot be undone.')) return;
    const res = await fetch(`/api/vault/documents/${id}`, { method: 'DELETE' });
    if (res.ok) setDocs(prev => prev.filter(d => d.id !== id));
    else alert('Could not delete this document. Please try again.');
  }

  return (
    <div className="designed-subpage">
      <Link href="/vault" className="back-link">Back to Personal</Link>
      <div className="portal-page-header">
        <div className="portal-page-header-icon">{documentIcon()}</div>
        <div>
          <h1>Documents</h1>
          <p>Store your will, trust, IDs, and other important papers. These stay private and are never shown on your public memorial page.</p>
        </div>
      </div>

      <div className="portal-pad">
        <input ref={fileInputRef} type="file" accept="application/pdf,image/*" multiple onChange={onPickFiles} style={{ display: 'none' }} />
        <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="add-btn" style={{ opacity: uploading ? 0.6 : 1 }}>
          {uploading ? 'Uploading...' : '+ Add document'}
        </button>
        {uploadError && <p className="field-error">{uploadError}</p>}

        {docs.length === 0 ? (
          <div className="empty-state compact">
            <div className="emoji">+</div>
            <p>No documents yet. Add your will, trust, IDs, or other important papers so your family knows where to find them.</p>
          </div>
        ) : (
          docs.map(doc => (
            <div key={doc.id} className="entry-card">
              <div className="entry-card-row">
                <div style={{ flex: 1 }}>
                  <div className="entry-title">{doc.fileName}</div>
                  <div className="field" style={{ marginTop: 10, marginBottom: 8 }}>
                    <select value={doc.category ?? ''} onChange={e => saveMeta(doc.id, { category: e.target.value })}>
                      <option value="">Uncategorized</option>
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <input
                    defaultValue={doc.notes ?? ''}
                    onBlur={e => saveMeta(doc.id, { notes: e.target.value })}
                    placeholder="Add a note (e.g. where the original is kept)..."
                    style={{ width: '100%', border: '1px solid rgba(145,104,82,0.2)', borderRadius: 9, padding: '8px 10px', fontSize: '0.82rem', color: '#2f241f', boxSizing: 'border-box' }}
                  />
                </div>
                <div className="entry-actions" style={{ flexDirection: 'column', gap: 6 }}>
                  <button onClick={() => download(doc)} disabled={downloadingId === doc.id} className="entry-link-btn">
                    {downloadingId === doc.id ? '...' : 'Download'}
                  </button>
                  <button onClick={() => remove(doc.id)} className="entry-link-btn danger">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function documentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c57b57" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  );
}
