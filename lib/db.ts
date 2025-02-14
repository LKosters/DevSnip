import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";

export interface CodeSnippet {
  id: string;
  userId: string;
  name: string;
  language: string;
  code: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export async function createSnippet({ userId, name, language, code }: {
  userId: string;
  name: string;
  language: string;
  code: string;
}) {
  return addDoc(collection(db, "snippets"), {
    userId,
    name,
    language,
    code,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function getUserSnippets(userId: string): Promise<CodeSnippet[]> {
  const q = query(collection(db, "snippets"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt,
    updatedAt: doc.data().updatedAt
  })) as CodeSnippet[];
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
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating snippet:", error);
    throw error;
  }
} 