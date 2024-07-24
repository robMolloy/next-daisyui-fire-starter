import { Typography } from "@/components";
import { db } from "@/config/firebaseConfig";
import {
  TDiceRollDbEntry,
  addDiceRollDbEntry as createDiceRollDbEntry,
  watchValidDiceRollDbEntries,
} from "@/db/dbDiceRolls";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";

const Parent = () => {
  const authStore = useAuthStore();
  const [docs, setDocs] = useState<TDiceRollDbEntry[]>([]);

  useEffect(() => {
    const safeStore = authStore.getSafeStore();
    if (safeStore.status !== "logged_in") return;
    const unsubscribe = watchValidDiceRollDbEntries({
      db,
      uid: safeStore.user.uid,
      onNewSnapshot: (x) => setDocs(x),
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className={`min-h-screen`}>
      <Typography fullPage>
        <button
          className="btn"
          onClick={() => {
            const safeStore = authStore.getSafeStore();
            if (safeStore.status !== "logged_in") return;
            createDiceRollDbEntry({
              db: db,
              formData: { uid: safeStore.user.uid, number: Math.floor(Math.random() * 6) },
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
