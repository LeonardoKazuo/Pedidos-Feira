import { db } from "./firebase.js";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { showToast } from "./toast.js";

export async function criarProduto(nome, preco) {
    try {
        await addDoc(collection(db, "nome"), {
            nome: nome,
            preco: Number(preco).toFixed(2),
        });
        showToast("Produto adicionado com sucesso!", "success");
        document.getElementById("txtCriar").value = ""
        document.getElementById("txtPreco").value = ""
    } catch (e) {
        console.error("Erro ao salvar", e);
        showToast("Erro ao adicionar produto.", "error");
    }
}

const formAdicionar = document.getElementById("formAdicionar");

formAdicionar.addEventListener("submit", (e) => {
    e.preventDefault();
    const txtCriar = document.getElementById("txtCriar").value
    const txtPreco = document.getElementById("txtPreco").value

    if (txtCriar !== "" && txtPreco !== "") {
        criarProduto(txtCriar, txtPreco)
    } else {
        showToast("Preencha os campos corretamente!", "error");
    }
});
