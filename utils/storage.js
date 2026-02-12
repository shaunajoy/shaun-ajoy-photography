import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function getPhotos() {
    try {
        const q = query(collection(db, "photos"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const photos = [];
        querySnapshot.forEach((doc) => {
            photos.push({ id: doc.id, ...doc.data() });
        });
        return photos;
    } catch (error) {
        console.error("Error getting photos from Firestore:", error);
        return [];
    }
}

// Deprecated in favor of direct Firestore usage in API routes, but kept for compatibility if needed
export async function savePhoto(photo) {
    // This is now handled directly in POST api route
    return photo;
}

export async function deletePhoto(id) {
    // This logic is also better placed in the API route or here.
    return null;
}

export async function updatePhoto(id, updates) {
    try {
        const photoRef = doc(db, "photos", id);
        await updateDoc(photoRef, updates);
        return { id, ...updates };
    } catch (error) {
        console.error("Error updating photo:", error);
        return null;
    }
}
