/**
 * ARQUIVO: login.js
 * Lógica de Autenticação do Usuário.
 */

 document.addEventListener('DOMContentLoaded', () => {
    if (document.body.id === 'tela-login') {
        configurarFormularioLogin();
    }
});

function configurarFormularioLogin() {
    const formLogin = document.getElementById('form-login');

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const emailDigitado = document.getElementById('campo-email').value;
            // A senha não é usada na verificação porque não é salva no localStorage por segurança
            // const senhaDigitada = document.getElementById('campo-senha').value; 
            
            const dadosSalvosJSON = localStorage.getItem('dadosUsuarioCadastrado');

            if (!dadosSalvosJSON) {
                alert('Nenhum usuário cadastrado. Por favor, cadastre-se primeiro!');
                return;
            }

            try {
                const dadosUsuario = JSON.parse(dadosSalvosJSON);
                
                if (dadosUsuario.emailUsuario === emailDigitado) {
                    
                    alert(`Login bem-sucedido! Bem-vindo(a) de volta, ${dadosUsuario.nomeCompleto.split(' ')[0]}!`);
                    
                    window.location.href = 'menu.html'; 
                    
                } else {
                    alert('Credenciais inválidas. Verifique seu e-mail.');
                }

            } catch (e) {
                console.error("Erro ao processar dados de login:", e);
                alert("Ocorreu um erro interno ao tentar realizar o login.");
            }
        });
    }
}
