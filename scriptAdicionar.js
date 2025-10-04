import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function criarProduto(nome, preco) {
    try {
        await addDoc(collection(db, "nome"), {
            nome: nome,
            preco: Number(preco).toFixed(2),
        });
        alert("Produto adicionado com sucesso!");
        document.getElementById("txtCriar").value = ""
        document.getElementById("txtPreco").value = ""
    } catch (e) {
        console.error("Erro ao salvar", e);
    }
}

const btnCriar = document.getElementById("btnCriar")

btnCriar.onclick = () => {
    const txtCriar = document.getElementById("txtCriar").value
    const txtPreco = document.getElementById("txtPreco").value

    if (txtCriar !== "" && txtPreco !== "") {
        criarProduto(txtCriar, txtPreco)
    } else {
        alert("Preencha os campos corretamente!");
    }
}
