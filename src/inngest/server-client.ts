import 'server-only';

import { Inngest } from 'inngest';

// The Inngest client.
// This has the secret key, so it should only be used on the server.
export const inngest = new Inngest({ id: 'audio-scribe-ai' });