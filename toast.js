export function showToast(message, type = "success") {
    const existingToast = document.getElementById("toast-notification");
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.id = "toast-notification";
    toast.classList.add("toast", `toast-${type}`);
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

export function showConfirm(message, onConfirm) {
    const existingModal = document.getElementById("confirm-modal");
    if (existingModal) {
        existingModal.remove();
    }

    const overlay = document.createElement("div");
    overlay.id = "confirm-modal";
    overlay.classList.add("confirm-overlay");

    const modal = document.createElement("div");
    modal.classList.add("confirm-box");

    const text = document.createElement("p");
    text.textContent = message;

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("confirm-btns");

    const btnCancel = document.createElement("button");
    btnCancel.textContent = "Cancelar";
    btnCancel.classList.add("btn-cancel");
    btnCancel.onclick = () => {
        overlay.remove();
    };

    const btnConfirm = document.createElement("button");
    btnConfirm.textContent = "Confirmar";
    btnConfirm.classList.add("btn-confirm");
    btnConfirm.onclick = () => {
        overlay.remove();
        onConfirm();
    };

    btnContainer.appendChild(btnCancel);
    btnContainer.appendChild(btnConfirm);

    modal.appendChild(text);
    modal.appendChild(btnContainer);
    overlay.appendChild(modal);

    document.body.appendChild(overlay);
}
