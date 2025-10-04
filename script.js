// Importando Firebase (usando ES Modules direto da CDN do Firebase)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  getDoc,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

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
const db = getFirestore(app);

export { db };

// Função para enviar pedido
async function enviarPedido() {
  try {
    const docRefCarrinho = doc(db, "carrinho", "E70hQKE6Iy1eLuGgSSKs");
    const docSnap = await getDoc(docRefCarrinho);

    if (!docSnap.exists()) {
      alert("Carrinho vazio!");
      return;
    }

    const data = docSnap.data();
    const produtosRaw = Array.isArray(data.produtos) ? data.produtos : [];
    const total = Number(data.total) || 0;

    if (produtosRaw.length === 0) {
      alert("Carrinho vazio!");
      return;
    }

    // Contar quantidade de cada produto
    const contagem = {};
    produtosRaw.forEach(nome => {
      contagem[nome] = (contagem[nome] || 0) + 1;
    });

    // Criar array de produtos com quantidade
    const produtos = Object.entries(contagem).map(([nome, quantidade]) => ({
      nome,
      quantidade
    }));

    // Salvar pedido na coleção "pedidos"
    await addDoc(collection(db, "pedidos"), {
      produtos,
      total: Number(total.toFixed(2)),
      data: new Date().toISOString()
    });

    // Limpar carrinho
    await setDoc(docRefCarrinho, { produtos: [], total: 0 });

    alert("Pedido enviado com sucesso!");
    modal.style.display = "none";

  } catch (err) {
    console.error("Erro ao enviar pedido:", err);
    alert("Erro ao enviar pedido.");
  }
}

// Vincular botão enviar
const btnEnviar = document.getElementById("enviarPedido");
if (btnEnviar) {
  btnEnviar.addEventListener("click", enviarPedido);
}

// Função para carregar lista de produtos
export async function carregarProdutos() {
  const querySnapshot = await getDocs(collection(db, "nome"));
  const listaProdutos = document.getElementById("listaProdutos");
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
export async function carregarResumo() {
  try {
    const querySnapshot = await getDocs(collection(db, "pedidos"));
    const resumo = {};

    querySnapshot.forEach((doc) => {
      const pedido = doc.data();
      if (pedido.produtos && Array.isArray(pedido.produtos)) {
        pedido.produtos.forEach(item => {
          resumo[item.nome] = (resumo[item.nome] || 0) + item.quantidade;
        });
      }
    });

    // Atualizar lista de produtos
    const listaResumo = document.getElementById("resumoPedidos");
    if (listaResumo) {
      listaResumo.innerHTML = "";
      for (let produto in resumo) {
        const li = document.createElement("li");
        li.textContent = `${produto}: ${resumo[produto]}`;
        listaResumo.appendChild(li);
      }
    }

    // Atualizar total de pedidos
    const totalPedidos = Object.values(resumo).reduce((acc, val) => acc + val, 0);
    const totalElement = document.getElementById("totalPedidos");
    if (totalElement) {
      totalElement.textContent = totalPedidos;
    }

  } catch (error) {
    console.error("Erro ao carregar resumo:", error);
  }
}

async function carregarCarrinho() {
  try {
    const docRef = doc(db, "carrinho", "E70hQKE6Iy1eLuGgSSKs");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const produtos = Array.isArray(data.produtos) ? data.produtos : [];
      const total = Number(data.total) || 0;

      lista.innerHTML = "";

      if (produtos.length === 0) {
        lista.innerHTML = "<li>(Carrinho vazio)</li>";
      } else {
        const contagem = {};
        produtos.forEach((p) => {
          contagem[p] = (contagem[p] || 0) + 1;
        });

        Object.entries(contagem).forEach(([nome, qtd]) => {
          const li = document.createElement("li");
          li.textContent = `${qtd}x ${nome}`;
          lista.appendChild(li);
        });
      }

      totalSpan.textContent = total.toFixed(2);
    } else {
      lista.innerHTML = "<li>Carrinho não encontrado.</li>";
      totalSpan.textContent = "0.00";
    }
  } catch (error) {
    console.error("Erro ao carregar carrinho:", error);
  }
}

async function atualizarCarrinho(nome, preco, operacao) {
  try {
    const docRef = doc(db, "carrinho", "E70hQKE6Iy1eLuGgSSKs");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      let produtos = [];
      if (Array.isArray(data.produtos)) {
        produtos = [...data.produtos];
      } else if (typeof data.produtos === "string" && data.produtos.trim() !== "") {
        produtos = [data.produtos.replace(/^"|"$/g, "")];
      }

      let total = Number(data.total) || 0;
      preco = Number(preco);

      if (operacao === "add") {
        produtos.push(nome);
        total += preco;
      } else if (operacao === "sub") {
        const index = produtos.indexOf(nome);
        if (index !== -1) {
          produtos.splice(index, 1);
          total -= preco;
          if (total < 0) total = 0;
        }
      }

      await updateDoc(docRef, {
        produtos,
        total,
      });
    }
  } catch (error) {
    console.error("Erro ao atualizar o carrinho:", error);
  }
}

// Modal
const modal = document.getElementById("modalCarrinho");
const abrir = document.getElementById("abrirCarrinho");
const fechar = document.getElementById("fecharCarrinho");
const lista = document.getElementById("listaProdutos");
const totalSpan = document.getElementById("totalCarrinho");
if (abrir) {
  abrir.addEventListener("click", async () => {
    await carregarCarrinho();
    modal.style.display = "flex";
  });

  fechar.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

// Função para buscar os documentos e criar botões para os pedidos
async function criarBotoes() {
  const container = document.getElementById("containerBotoes");

  try {
    const querySnapshot = await getDocs(collection(db, "nome"));
    container.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.nome) {

        const div = document.createElement("div")
        div.classList.add('divProduto');

        const preco = document.createElement("ul")
        preco.textContent = `R$${data.preco}`

        const prod = document.createElement("ul");
        prod.textContent = data.nome;

        const btnAdd = document.createElement("button");
        btnAdd.classList.add('btnAdd');
        btnAdd.textContent = "Adicionar"

        const btnSub = document.createElement("button");
        btnSub.textContent = "Remover"
        btnSub.classList.add('btnSub');

        btnAdd.onclick = () => {
          atualizarCarrinho(data.nome, data.preco, "add");
        };

        btnSub.addEventListener("click", () => {
          atualizarCarrinho(data.nome, data.preco, "sub");
        });

        const btnContainer = document.createElement("div");
        btnContainer.classList.add("btnContainer");
        btnContainer.appendChild(btnAdd);
        btnContainer.appendChild(btnSub);

        div.appendChild(preco);
        div.appendChild(prod);
        div.appendChild(btnContainer);
        container.appendChild(div);
      }
    });

    if (container.innerHTML === "") {
      container.innerHTML = "<p>Nenhum produto encontrado.</p>";
    }

  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    container.innerHTML = "<p>Erro ao carregar os produtos.</p>";
  }
}

// Eventos automáticos
window.onload = () => {
  if (document.getElementById("containerBotoes")) {
    criarBotoes();
    carregarCarrinho();
  }

  if (document.getElementById("resumoPedidos")) {
    carregarResumo();
  }
};
