import { database } from "@/utils/firebase";
import { ref, onValue, set } from "firebase/database";

export const getData = (table, cb) => {
  const db = database;
  const starCountRef = ref(db, table);

  return onValue(starCountRef, cb);
};

export const sendData = (table, cb) => {
  const db = database;
  const Ref = ref(db, table);

  return set(Ref, cb);
};
