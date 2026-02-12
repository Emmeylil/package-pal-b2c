import { writable } from 'svelte/store';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

/** @type {import('svelte/store').Writable<import('firebase/auth').User | null>} */
export const user = writable(null);
export const authLoading = writable(true);

if (typeof window !== 'undefined') {
    onAuthStateChanged(auth, (u) => {
        /** @type {any} */
        const val = u;
        user.set(val);
        authLoading.set(false);
    });
}
