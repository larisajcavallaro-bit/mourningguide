export type Field =
  | { type: 'text' | 'email' | 'date'; id: string; label: string; placeholder?: string; hint?: string; required?: boolean }
  | { type: 'textarea'; id: string; label: string; placeholder?: string; hint?: string; required?: boolean; rows?: number }
  | { type: 'select'; id: string; label: string; placeholder?: string; options: string[]; required?: boolean }
  | { type: 'file'; id: string; label: string; accept: string; title: string; sub: string; hint?: string };

export type SetupConfig = {
  slug: string;
  title: string;
  sub: string;
  icon: 'photo' | 'file' | 'music' | 'speaker' | 'voice';
  saveLabel: string;
  addAnotherLabel: string;
  savedTitle: string;
  fields: Field[];
  summary: (values: Record<string, string>) => { title: string; meta: string };
};

export const SETUPS: Record<string, SetupConfig> = {
  photos: {
    slug: 'photos',
    title: 'Photos & memories',
    sub: 'Upload photos with captions. These will be shown on your memorial portal and shared with loved ones after you pass.',
    icon: 'photo',
    saveLabel: 'Save photo',
    addAnotherLabel: 'Add another photo',
    savedTitle: 'Saved photos',
    fields: [
      { type: 'file', id: 'file', label: 'Photo', accept: 'image/*', title: 'Tap to choose a photo', sub: 'JPG, PNG, HEIC - up to 20 MB' },
      { type: 'text', id: 'caption', label: 'Caption or title', placeholder: 'e.g. Our last family Christmas, 2023', required: true },
      { type: 'textarea', id: 'memory', label: 'Memory or story (optional)', placeholder: 'Share the story behind this photo - who is in it, where it was taken, why it matters to you.' },
    ],
    summary: v => ({ title: v.caption || v.file || 'Photo', meta: v.file || 'Photo' }),
  },
  'voice-video': {
    slug: 'voice-video',
    title: 'Voice & video messages',
    sub: 'Upload a voice or video recording. Deliver it to named recipients after you pass, or mark it for your memorial portal.',
    icon: 'voice',
    saveLabel: 'Save message',
    addAnotherLabel: 'Add another message',
    savedTitle: 'Saved messages',
    fields: [
      { type: 'file', id: 'file', label: 'Recording', accept: 'audio/*,video/*', title: 'Tap to upload audio or video', sub: 'MP3, M4A, MP4, MOV - up to 500 MB', hint: 'You can record a voice memo on your phone and upload it here.' },
      { type: 'text', id: 'title', label: 'Title or label', placeholder: 'e.g. A message for Maria on her wedding day', required: true },
      { type: 'select', id: 'type', label: 'Type', placeholder: 'Select...', options: ['Voice message', 'Video message'] },
      { type: 'text', id: 'recipient', label: 'Who is this for? (optional)', placeholder: 'e.g. Maria, my grandchildren, everyone' },
      { type: 'textarea', id: 'notes', label: 'Notes', placeholder: 'e.g. Play this at the end of the service / Send to Maria privately when the time feels right.' },
    ],
    summary: v => ({ title: v.title || v.file || 'Recording', meta: [v.type, v.recipient ? `For ${v.recipient}` : ''].filter(Boolean).join(' · ') || 'Saved recording' }),
  },
  music: {
    slug: 'music',
    title: 'Music for your service',
    sub: 'Choose songs for your funeral or memorial. Add notes for whoever is organizing - when each should play, and why it matters.',
    icon: 'music',
    saveLabel: 'Add song',
    addAnotherLabel: 'Add another song',
    savedTitle: 'Your playlist',
    fields: [
      { type: 'text', id: 'title', label: 'Song title', placeholder: 'e.g. Ave Maria, What a Wonderful World, Hallelujah', required: true },
      { type: 'text', id: 'artist', label: 'Artist or composer', placeholder: 'e.g. Louis Armstrong, Leonard Cohen' },
      { type: 'select', id: 'when', label: 'When should it play?', placeholder: 'Select a moment...', options: ['As guests arrive', 'During the processional', 'During the service', 'During a reflection or silent moment', 'During the recessional', 'At the graveside', 'At the reception / wake', 'No specific moment - just include it'] },
      { type: 'textarea', id: 'notes', label: 'Notes for the organizer (optional)', placeholder: 'e.g. This was our wedding song. Please have it played quietly as people arrive.' },
    ],
    summary: v => ({ title: v.artist ? `${v.title} - ${v.artist}` : v.title, meta: v.when || 'No moment specified' }),
  },
  speakers: {
    slug: 'speakers',
    title: 'Speakers & readings',
    sub: "Choose who you'd like to speak at your service - and leave them notes. Add as many people as you'd like.",
    icon: 'speaker',
    saveLabel: 'Add speaker',
    addAnotherLabel: 'Add another speaker',
    savedTitle: 'Your speakers',
    fields: [
      { type: 'text', id: 'name', label: 'Name', placeholder: "e.g. My daughter Maria, Father O'Brien", required: true },
      { type: 'select', id: 'role', label: 'Role', placeholder: 'Select a role...', options: ['Eulogy', 'Reading', 'Poem', 'Prayer', 'Song / performance', 'Tribute or story', 'Officiant', 'Other'] },
      { type: 'textarea', id: 'notes', label: 'Notes for them (optional)', placeholder: "e.g. I'd love her to read the poem. Please keep it light - share the funny stories, not just the kind ones." },
    ],
    summary: v => ({ title: v.name, meta: v.role || 'No role selected' }),
  },
  obituary: {
    slug: 'obituary',
    title: 'Obituary & eulogy',
    sub: 'Write it yourself, or leave key details for someone else to write from. Either way, your words and memories are preserved here.',
    icon: 'file',
    saveLabel: 'Save',
    addAnotherLabel: 'Clear form',
    savedTitle: 'Saved notes',
    fields: [
      { type: 'textarea', id: 'body', label: 'Your obituary or eulogy', rows: 9, placeholder: "Write in your own voice. There's no right or wrong way - even a few sentences is meaningful.", required: true },
      { type: 'text', id: 'reader', label: 'Who should read or deliver this? (optional)', placeholder: 'e.g. My daughter Maria, or the officiant' },
      { type: 'text', id: 'writer', label: 'Who should write this if not you? (optional)', placeholder: 'e.g. My son Patrick - he knows my story best' },
    ],
    summary: v => ({ title: v.reader ? `For ${v.reader}` : 'Obituary / eulogy notes', meta: v.writer ? `Writer: ${v.writer}` : 'Saved in your words' }),
  },
};
