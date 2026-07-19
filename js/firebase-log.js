import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAgR0vPelPAfcXSkEHfT3bmypHpd8dLcKY",
  authDomain: "saem-security-5d2b5.firebaseapp.com",
  projectId: "saem-security-5d2b5",
  storageBucket: "saem-security-5d2b5.firebasestorage.app",
  messagingSenderId: "513970972570",
  appId: "1:513970972570:web:a1f400127b7e9318dc7c23"
};

(function logVisit() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    addDoc(collection(db, "visits"), {
      ts: serverTimestamp(),
      page: location.pathname,
      url: location.href,
      referrer: document.referrer || null,
      lang: document.documentElement.getAttribute("lang") || null,
      userAgent: navigator.userAgent,
      screen: `${window.screen.width}x${window.screen.height}`,
    })
      .then(() => console.log("[firebase-log] yazma başarılı"))
      .catch((err) => {
        // DEBUG: sorun çözülünce bu satırı yorum satırı yapıp
        // yerine sessiz bir catch koyabilirsiniz.
        console.error("[firebase-log] Firestore yazma hatası:", err.code || err);
      });
  } catch (e) {
    console.error("[firebase-log] initializeApp/getFirestore hatası:", e);
  }
})();