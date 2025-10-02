// Importando Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// 🔥 CONFIGURAÇÃO DO FIREBASE → substitua pelos dados do seu projeto
const firebaseConfig = {
  apiKey: "AIzaSyDR9S3IB3eceUl5As0Zib2pMko6MqK_xGw",
  authDomain: "sistema-feira.firebaseapp.com",
  projectId: "sistema-feira",
  storageBucket: "sistema-feira.firebasestorage.app",
  messagingSenderId: "327933864971",
  appId: "1:327933864971:web:34d03de6ce8dce5d1fab0e",
  measurementId: "G-RHN8LG7M1F"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Função para salvar pedidos
async function salvarPedido(produto, quantidade) {
  try {
    await addDoc(collection(db, "pedidos"), {
      produto: produto,
      quantidade: parseInt(quantidade)
    });
    alert("Pedido registrado com sucesso!");
  } catch (e) {
    console.error("Erro ao salvar pedido: ", e);
  }
}

// Função para carregar lista de pedidos
async function carregarPedidos() {
  const querySnapshot = await getDocs(collection(db, "pedidos"));
  const lista = document.getElementById("listaPedidos");
  if (lista) {
    lista.innerHTML = "";
    querySnapshot.forEach((doc) => {
      let li = document.createElement("li");
      li.textContent = `${doc.data().quantidade}x ${doc.data().produto}`;
      lista.appendChild(li);
    });
  }
}

// Função para carregar resumo
async function carregarResumo() {
  const querySnapshot = await getDocs(collection(db, "pedidos"));
  const resumo = {};
  querySnapshot.forEach((doc) => {
    let p = doc.data();
    resumo[p.produto] = (resumo[p.produto] || 0) + p.quantidade;
  });

  const listaResumo = document.getElementById("resumoPedidos");
  if (listaResumo) {
    listaResumo.innerHTML = "";
    for (let produto in resumo) {
      let li = document.createElement("li");
      li.textContent = `${produto}: ${resumo[produto]} no total`;
      listaResumo.appendChild(li);
    }
  }
}

// Eventos automáticos
window.onload = () => {
  if (document.getElementById("pedidoForm")) {
    document.getElementById("pedidoForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const produto = document.getElementById("produto").value;
      const quantidade = document.getElementById("quantidade").value;
      salvarPedido(produto, quantidade);
      e.target.reset();
    });
  }

  if (document.getElementById("listaPedidos")) {
    carregarPedidos();
  }

  if (document.getElementById("resumoPedidos")) {
    carregarResumo();
  }
};