'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}

export function initializeFirebase() {
  if (typeof window === 'undefined') {
    // During server-side rendering, we need to return a mock object
    // or handle this case gracefully. Returning null or a mock
    // implementation of the SDKs.
    return {
      firebaseApp: null,
      auth: null,
      firestore: null,
    };
  }

  if (!getApps().length) {
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function initFirebaseClient() {
  if (typeof window === 'undefined') return;
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
}
