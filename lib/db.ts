import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, Timestamp, limit, startAfter, orderBy, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export interface CodeSnippet {
  id: string;
  userId: string;
  name: string;
  language: string;
  code: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
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

export async function getUserSnippets(
  userId: string, 
  pageSize = 4, 
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ snippets: CodeSnippet[], lastVisible: QueryDocumentSnapshot<DocumentData> | null }> {
  let snippetsQuery;
  
  if (lastDoc) {
    snippetsQuery = query(
      collection(db, "snippets"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(pageSize)
    );
  } else {
    snippetsQuery = query(
      collection(db, "snippets"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );
  }
  
  const querySnapshot = await getDocs(snippetsQuery);
  const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;
  
  const snippets = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null
    } as CodeSnippet;
  });
  
  return { snippets, lastVisible };
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