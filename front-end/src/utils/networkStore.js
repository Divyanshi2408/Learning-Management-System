// src/utils/networkStore.js
export function subscribe(callback) {
    window.addEventListener("online", callback);
    window.addEventListener("offline", callback);

    return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
    };
}

export function getSnapshot() {
    return navigator.onLine;
}
