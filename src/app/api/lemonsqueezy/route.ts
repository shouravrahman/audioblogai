import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAdmin } from '@/app/firebase-admin';

const { firestore } = getFirebaseAdmin();

export async function POST(req: NextRequest) {
  if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }
  
  const rawBody = await req.text();
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signature = Buffer.from(req.headers.get('X-Signature') || '', 'utf8');
  
  if (!crypto.timingSafeEqual(digest, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const { meta, data } = payload;
  
  if (meta.event_name.startsWith('subscription_')) {
    const userId = meta.custom_data?.user_id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in webhook payload' }, { status: 400 });
    }

    const subscription = {
      userId: userId,
      lemonSqueezyId: data.id,
      orderId: data.attributes.order_id,
      name: data.attributes.product_name,
      email: data.attributes.user_email,
      status: data.attributes.status,
      renewsAt: data.attributes.renews_at,
      endsAt: data.attributes.ends_at,
      trialEndsAt: data.attributes.trial_ends_at,
      planId: data.attributes.variant_id,
      lastUpdated: serverTimestamp(),
    };

    try {
      // Use the Lemon Squeezy subscription ID as the document ID for idempotency
      const subRef = doc(firestore, `users/${userId}/subscriptions`, data.id);
      await setDoc(subRef, subscription, { merge: true });
      
      return NextResponse.json({ success: true });

    } catch (error: any) {
      console.error('Error writing subscription to Firestore:', error);
      return NextResponse.json({ error: 'Failed to update user subscription' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
