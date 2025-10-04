import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { collection, onSnapshot, getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

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
const somConfirmacao = new Audio("doorbell.mp3");

export function atualizarPedidosEmTempoReal() {
    const container = document.getElementById("containerPedidos");
    if (!container) return;

    const pedidosRef = collection(db, "pedidos");

    onSnapshot(pedidosRef, (snapshot) => {
        somConfirmacao.play();
        container.innerHTML = "";

        // Filtra apenas pedidos que não estão prontos
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
                <h3>Pedido</h3>
                <p>${produtosStr}</p>
                <p class="total">Total: R$ ${pedido.total.toFixed(2)}</p>
                <button class="btnPronto">Marcar como pronto</button>
            `;

            container.appendChild(divNota);

            const btn = divNota.querySelector(".btnPronto");
            btn.addEventListener("click", async () => {
                const confirmar = confirm("Tem certeza que deseja marcar este pedido como pronto?");
                if (!confirmar) return; // Sai se o usuário cancelar

                const docRef = doc(db, "pedidos", docSnap.id);
                await updateDoc(docRef, { status: "pronto" });
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