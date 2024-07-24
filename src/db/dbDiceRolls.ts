import { db } from "@/config/firebaseConfig";
import {
  Firestore,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { z } from "zod";
const collName = "diceRolls";

const firestoreTimestamp = z.object({ seconds: z.number() });
const diceRollDbEntrySchema = z.object({
  id: z.string(),
  uid: z.string(),
  number: z.number(),
  createdAt: firestoreTimestamp,
});
const diceRollNewDbEntrySeedSchema = diceRollDbEntrySchema.omit({ createdAt: true, id: true });
export type TDiceRollDbEntry = z.infer<typeof diceRollDbEntrySchema>;
export type TDiceRollNewDbEntrySeed = z.infer<typeof diceRollNewDbEntrySeedSchema>;

export const addDiceRollDbEntry = (x: { db: Firestore; formData: TDiceRollNewDbEntrySeed }) => {
  const newDiceRoll = { ...x.formData, createdAt: serverTimestamp() };
  addDoc(collection(x.db, collName), newDiceRoll);
};

export const watchValidDiceRollDbEntries = (p: {
  db: Firestore;
  uid: string;
  orderKey?: keyof TDiceRollDbEntry;
  orderDirection?: "desc" | "asc";
  onNewSnapshot?: (x: TDiceRollDbEntry[]) => void;
  onSnapshotSummary?: (x: {
    all: TDiceRollDbEntry[] | undefined;
    added: TDiceRollDbEntry[];
  }) => void;
  onAddedDoc?: (x: TDiceRollDbEntry) => void;
}) => {
  const collectionRef = collection(db, collName);
  const orderKey = p.orderKey ?? "createdAt";
  const orderDirection = p.orderDirection ?? "desc";
  const q1 = query(collectionRef, where("uid", "==", p.uid), orderBy(orderKey, orderDirection));
  let first = true;
  const unsub = onSnapshot(q1, (snapshot) => {
    const snapshotSummary = {
      all: [] as TDiceRollDbEntry[],
      added: [] as TDiceRollDbEntry[],
    };
    const docs = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .map((x) => diceRollDbEntrySchema.safeParse(x))
      .map((x) => {
        /**
         * following line commented due to strange behaviour on immediate snapshot after new dbEntry;
         *   - createdAt is initially null then is followed up with correct data
         */

        // TODO test if only on local
        // if (!x.success) console.error({ x });
        if (x.success) return x.data;
      })
      .filter((x) => !!x) as TDiceRollDbEntry[];
    if (p.onNewSnapshot) p.onNewSnapshot(docs);
    snapshotSummary.all = docs;

    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const newDoc = { id: change.doc.id, ...change.doc.data() };
        const parseResponse = diceRollDbEntrySchema.safeParse(newDoc);
        if (!parseResponse.success) return;
        if (!first && p.onAddedDoc) p.onAddedDoc(parseResponse.data);
        if (!first) snapshotSummary.added.push(parseResponse.data);
      }
    });
    if (p.onSnapshotSummary) p.onSnapshotSummary(snapshotSummary);

    first = false;
  });
  return unsub;
};
