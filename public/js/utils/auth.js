// Função para autenticar o usuário e armazenar as credenciais
export async function authenticateUser(email, password, remember) {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Obtém o token de ID do usuário
    const token = await user.getIdToken();

    // Armazena o token junto com as informações do usuário
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify({ uid: user.uid, email: user.email, token }));

    return user;
}

// Função para verificar se o usuário está logado ao carregar a página
export function getUserLogged() {
    const localUser = localStorage.getItem('user');
    const sessionUser = sessionStorage.getItem('user');
    return localUser ? JSON.parse(localUser) : sessionUser ? JSON.parse(sessionUser) : null;
}

export function isLoggedUser(){
    try {
        verifyToken();

        return getUserLogged();
    } catch (error) {
        logout();
    }
}

async function verifyToken(){
    try {
        const user = getUserLogged();

        if(!user) return false;

        const response = await fetch('/verify-token', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}` 
            },
        });


        if (!response.ok) {
            const error = await response.json();
            errorMessage(error.error);
            return logout();
        } 

        return getUserLogged();
    } catch (error) {
        logout();
    }
}

export function logout() {
    firebase.auth().signOut().then(() => {
        localStorage.removeItem('user'); // Remove o usuário do localStorage
        sessionStorage.removeItem('user'); // Remove o usuário do localStorage
        window.location.href = '/login'; // Redireciona para a tela de login
    }).catch((error) => {
        console.error("Erro ao sair: ", error);
    });
}