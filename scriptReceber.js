import { db } from "./firebase.js";
import { collection, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { showConfirm, showToast } from "./toast.js";

const somConfirmacao = new Audio("doorbell.mp3");

export function atualizarPedidosEmTempoReal() {
    const container = document.getElementById("containerPedidos");
    if (!container) return;

    const pedidosRef = collection(db, "pedidos");

    onSnapshot(pedidosRef, (snapshot) => {
        somConfirmacao.play().catch(() => {}); // handle autoplay policies
        container.innerHTML = "";

        const pedidosPendentes = snapshot.docs.filter(docSnap => {
            const pedido = docSnap.data();
            return pedido.status !== "pronto";
        });

        pedidosPendentes.forEach((docSnap) => {
            const pedido = docSnap.data();

            const divNota = document.createElement("div");
            divNota.classList.add("nota-adesiva");

            const produtosStr = pedido.produtos
                .map(p => `${p.quantidade}x ${p.nome}`)
                .join(", ");

            divNota.innerHTML = `
                <h3>Senha ${pedido.numeroPedido}</h3>
                <p>${produtosStr}</p>
                <p class="total">Total: R$ ${pedido.total.toFixed(2)}</p>
                <button class="btnPronto btn-primary">Marcar como pronto</button>
            `;

            container.appendChild(divNota);

            const btn = divNota.querySelector(".btnPronto");
            btn.addEventListener("click", () => {
                showConfirm("Tem certeza que deseja marcar este pedido como pronto?", async () => {
                    try {
                        const docRef = doc(db, "pedidos", docSnap.id);
                        await updateDoc(docRef, { status: "pronto" });
                        showToast("Pedido marcado como pronto!", "success");
                    } catch(e) {
                        showToast("Erro ao marcar pedido.", "error");
                    }
                });
            });

        });

        if (pedidosPendentes.length === 0) {
            container.innerHTML = "<p>Nenhum pedido pendente no momento.</p>";
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("containerPedidos");
    if (container) {
        atualizarPedidosEmTempoReal();
    }
});