'use server';

import { EventSchemas, Inngest } from 'inngest';
import type { Events } from './events';

export const inngest = new Inngest({ id: 'audio-scribe-ai', schemas: new EventSchemas().fromRecord<Events>() });