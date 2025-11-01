import { EventSchemas, Inngest } from 'inngest';
import type { Events } from './events';

// The Inngest client.
// This is not instantiated with a secret key, so it's safe to use in the browser.
export const inngest = new Inngest({ id: 'audio-scribe-ai', schemas: new EventSchemas().fromRecord<Events>() });
