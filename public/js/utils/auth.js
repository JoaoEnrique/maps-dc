// Função para autenticar o usuário e armazenar as credenciais
export async function authenticateUser(email, password, remember) {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify({ uid: user.uid, email: user.email }));

    return user;
}

// Função para verificar se o usuário está logado ao carregar a página
export function getUserLogged() {
    const localUser = localStorage.getItem('user');
    const sessionUser = sessionStorage.getItem('user');
    return localUser ? JSON.parse(localUser) : sessionUser ? JSON.parse(sessionUser) : null;
}

export function isLoggedUser(){
    return getUserLogged();
}

export function logout() {
    firebase.auth().signOut().then(() => {
        localStorage.removeItem('user'); // Remove o usuário do localStorage
        window.location.href = '/login'; // Redireciona para a tela de login
    }).catch((error) => {
        console.error("Erro ao sair: ", error);
    });
}