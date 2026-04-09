import { db } from "./firebase.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { showConfirm, showToast } from "./toast.js";

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
        btnExcluir.classList.add("btn-danger");
        btnExcluir.textContent = "Excluir";

        btnExcluir.addEventListener("click", () => {
          showConfirm(`Excluir ${data.nome}?`, async () => {
            try {
              await deleteDoc(doc(db, COLECAO, docSnap.id));
              showToast("Produto excluído.", "success");
              carregarNomes();
            } catch(e) {
              showToast("Erro ao excluir produto.", "error");
            }
          });
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