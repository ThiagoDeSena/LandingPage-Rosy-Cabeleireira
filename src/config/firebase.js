import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig =
    typeof window !== 'undefined' && window.__firebase_config
        ? JSON.parse(window.__firebase_config)
        : {
            apiKey: 'mock-api-key',
            authDomain: 'mock-app.firebaseapp.com',
            projectId: 'mock-app',
            storageBucket: 'mock-app.appspot.com',
            messagingSenderId: '1234567890',
            appId: '1:1234567890:web:mockappid',
        };

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = typeof window !== 'undefined' && window.__app_id ? window.__app_id : 'rosy-cabeleireira-app';
