import { NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export async function GET() {
    try {
        const q = query(collection(db, "photos"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const photos = [];
        querySnapshot.forEach((doc) => {
            photos.push({ id: doc.id, ...doc.data() });
        });
        return NextResponse.json(photos);
    } catch (error) {
        console.error("Error getting photos:", error);
        return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const title = formData.get('title') || 'Untitled';
        const description = formData.get('description') || '';

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = new Uint8Array(bytes);

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
        const storageRef = ref(storage, 'uploads/' + filename);

        // Upload to Firebase Storage
        await uploadBytes(storageRef, buffer);
        const downloadURL = await getDownloadURL(storageRef);

        // Save metadata to Firestore
        const newPhoto = {
            src: downloadURL,
            title,
            description,
            date: new Date().toISOString(),
            storagePath: 'uploads/' + filename // Keep track of storage path for deletion
        };

        const docRef = await addDoc(collection(db, "photos"), newPhoto);

        return NextResponse.json({ id: docRef.id, ...newPhoto }, { status: 201 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        const docRef = doc(db, "photos", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
        }

        const photoData = docSnap.data();

        // Delete from Storage if path exists
        if (photoData.storagePath) {
            try {
                const storageRef = ref(storage, photoData.storagePath);
                await deleteObject(storageRef);
            } catch (storageError) {
                console.warn("Could not delete file from storage (might already be gone):", storageError);
            }
        } else if (photoData.src && photoData.src.includes('firebasestorage')) {
            // Fallback: try to derive ref from URL if storagePath wasn't saved (legacy)
            // simplified for now, assuming storagePath is saved for new photos
        }

        // Delete from Firestore
        await deleteDoc(docRef);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, title, description } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        const docRef = doc(db, "photos", id);
        await updateDoc(docRef, { title, description });

        return NextResponse.json({ id, title, description });
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}
