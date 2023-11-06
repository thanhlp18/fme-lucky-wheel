// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore/lite";
let data = [
  {
    percentpage: 0.55,
    hasPrizeCode: false,
    text: "Voucher 50k cho khóa học bất kỳ",
    number: 400,
  },
  {
    hasPrizeCode: false,
    percentpage: 0.3,
    text: "Voucher 100k cho khóa học bất kỳ",
    number: 150,
  },
  {
    percentpage: 0.1,
    hasPrizeCode: true,
    text: "Voucher 500k cho khóa học bất kỳ",
    prizeCodePool: [
      "V500k1210BK1",
      "V500k1210BK2",
      "V500k1210BK3",
      "V500k1210BK4",
      "V500k1210BK5",
      "V500k1210BK6",
      "V500k1210BK7",
      "V500k1210BK8",
      "V500k1210BK9",
      "V500k1210BK10",
    ],
    number: 10,
  },
  {
    hasPrizeCode: false,
    percentpage: 0,
    text: "Khóa học tiếng Anh Online miễn phí",
    number: 999,
  },
  {
    percentpage: 0.05,
    hasPrizeCode: true,
    text: "Vé xem phim",
    prizeCodePool: [
      // "GGV1210BK01",
      // "GGV1210BK02",
      "GGV1210BK03",
      "GGV1210BK04",
      // "GGV1210BK05",
    ],
    number: 2,
  },
];
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsbdgojzQm-h0HDoZvn__yRY1Hwz03Wbs",
  authDomain: "fme-lucky-wheel.firebaseapp.com",
  projectId: "fme-lucky-wheel",
  storageBucket: "fme-lucky-wheel.appspot.com",
  messagingSenderId: "995289571434",
  appId: "1:995289571434:web:156cdbbc8a0d39d5ac6a13",
  measurementId: "G-0E2VCP4YYE",
  databaseURL:
    "https://fme-lucky-wheel-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);
// const db = getDatabase(app);

export async function setPrizeData() {
  // 1. Prize doc information
  data.map((prize, idx) => {
    const prizesRef = doc(firestore, `prizes/${prize.text}`);
    setDoc(prizesRef, prize, { merge: true });
  });
}

setPrizeData();
