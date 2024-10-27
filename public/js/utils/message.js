export async function errorMessage(message) {
    console.error(message);
    document.querySelector(".error-message").style.display = 'flex';
    document.querySelector(".success-message").style.display = 'none';
    document.querySelector(".error-message-text").innerHTML = message;
}

export function successMessage(message) {
    document.querySelector(".success-message").style.display = 'flex';
    document.querySelector(".error-message").style.display = 'none';
    document.querySelector(".success-message-text").innerHTML = message;
}
