import { NextResponse } from 'next/server';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

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
    console.log("POST /api/photos metadata save requested");
    try {
        const body = await request.json();
        const { src, title, description, storagePath } = body;

        console.log(`Received metadata for: ${title}`);

        if (!src) {
            console.error("Missing source URL in request body");
            return NextResponse.json({ error: 'Missing source URL' }, { status: 400 });
        }

        // Save metadata to Firestore
        const newPhoto = {
            src,
            title: title || 'Untitled',
            description: description || '',
            date: new Date().toISOString(),
            storagePath: storagePath || null
        };

        try {
            const docRef = await addDoc(collection(db, "photos"), newPhoto);
            console.log(`Saved to Firestore with ID: ${docRef.id}`);
            return NextResponse.json({ id: docRef.id, ...newPhoto }, { status: 201 });
        } catch (dbErr) {
            console.error("Firestore save failed:", dbErr);
            return NextResponse.json({ error: 'Database save failed: ' + dbErr.message }, { status: 500 });
        }

    } catch (error) {
        console.error('Final metadata save catch error:', error);
        return NextResponse.json({ error: 'Request parse failed: ' + error.message }, { status: 500 });
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
