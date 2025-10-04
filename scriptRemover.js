import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDR9S3IB3eceUl5As0Zib2pMko6MqK_xGw",
  authDomain: "sistema-feira.firebaseapp.com",
  projectId: "sistema-feira",
  storageBucket: "sistema-feira.firebasestorage.app",
  messagingSenderId: "327933864971",
  appId: "1:327933864971:web:34d03de6ce8dce5d1fab0e",
  measurementId: "G-RHN8LG7M1F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const COLECAO = "nome";

async function carregarNomes() {
  const container = document.getElementById("listaNomes");
  container.innerHTML = "<p>Carregando...</p>";

  try {
    const snapshot = await getDocs(collection(db, COLECAO));
    container.innerHTML = "";

    if (snapshot.empty) {
      container.innerHTML = "<p>Nenhum nome encontrado.</p>";
      return;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.nome) {
        const div = document.createElement("div");
        div.className = "item-nome";

        const nomeSpan = document.createElement("span");
        nomeSpan.textContent = data.nome;

        const precoSpan = document.createElement("span");
        precoSpan.textContent = `R$${data.preco}`

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";

        btnExcluir.addEventListener("click", async () => {
          if (confirm(`Excluir ${data.nome}?`)) {
            await deleteDoc(doc(db, COLECAO, docSnap.id));
            carregarNomes();
          }
        });

        div.appendChild(nomeSpan);
        div.appendChild(precoSpan);
        div.appendChild(btnExcluir);
        container.appendChild(div);
      }
    });
  } catch (erro) {
    console.error("Erro ao carregar nomes:", erro);
    container.innerHTML = "<p>Erro ao carregar dados.</p>";
  }
}

window.onload = () => {
  carregarNomes();
}