import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

export interface CodeSnippet {
  id?: string;
  userId: string;
  name: string;
  language: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function createSnippet(snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, "snippets"), {
      ...snippet,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding snippet:", error);
    throw error;
  }
}

export async function getUserSnippets(userId: string) {
  try {
    const snippetsRef = collection(db, "snippets");
    const q = query(snippetsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as CodeSnippet[];
  } catch (error) {
    console.error("Error getting snippets:", error);
    throw error;
  }
}

export async function deleteSnippet(snippetId: string) {
  try {
    await deleteDoc(doc(db, "snippets", snippetId));
  } catch (error) {
    console.error("Error deleting snippet:", error);
    throw error;
  }
}

export async function updateSnippet(snippetId: string, data: Partial<CodeSnippet>) {
  try {
    const snippetRef = doc(db, "snippets", snippetId);
    await updateDoc(snippetRef, {
      ...data,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating snippet:", error);
    throw error;
  }
} 