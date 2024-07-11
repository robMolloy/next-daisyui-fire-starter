import { Typography } from "@/components";
import { auth, db } from "@/config/firebaseConfig";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const collName = "diceRolls";

const Parent = () => {
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    const colRef = collection(db, collName);
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const documents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setDocs(documents);
    });

    return () => unsubscribe();
  }, []);
  return (
    <main className={`min-h-screen`}>
      <Typography fullPage>
        <button
          className="btn"
          onClick={() => {
            addDoc(collection(db, collName), {
              uid: auth.currentUser?.uid,
              number: Math.floor(Math.random() * 10000000),
            });
          }}
        >
          add something
        </button>
        {<pre>{JSON.stringify(docs, undefined, 2)}</pre>}
      </Typography>
    </main>
  );
};

export default Parent;
