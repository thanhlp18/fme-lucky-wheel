// Import the functions you need from the SDKs you need
import { async } from "@firebase/util";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  getDatabase,
} from "firebase/firestore/lite";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);
// const db = getDatabase(app);

export async function updatePrizeData(prizeData) {
  // 1. Prize doc information
  const prizesRef = doc(firestore, `prizes/${prizeData.text}`);
  // 2. Get current prize doc
  const prizeSnap = await getDoc(prizesRef);
  var currentPrizeData = prizeSnap.data();
  // 3. Update data

  // 3.1 Update prize code
  if (prizeData.hasPrizeCode) {
    // prizeData.prizeCodePool.shift();
    if (
      currentPrizeData.prizeCodePool.length > prizeData.prizeCodePool.length
    ) {
      prizeData.prizeCodePool.shift();
    } else {
      currentPrizeData.prizeCodePool.shift();
      prizeData.prizeCodePool = currentPrizeData.prizeCodePool;
    }
  }
  // 3.2 Update prize quantity
  if (currentPrizeData.number > prizeData.number) {
    setDoc(prizesRef, prizeData, { merge: true });
  } else {
    setDoc(
      prizesRef,
      { ...prizeData, number: currentPrizeData.number - 1 },
      { merge: true }
    );
  }
}

export async function getPrizesData() {
  // const prizesDoc = doc(firestore, "prizes");
  const prizesRef = collection(firestore, "prizes");
  const prizes = [];

  await getDocs(prizesRef).then((snapshot) => {
    snapshot.forEach((doc) => {
      prizes.push(doc.data());
    });
  });
  prizes.sort((a, b) => b.percentpage - a.percentpage);
  console.log("DATA NEW: ", prizes);
  return prizes;
}
