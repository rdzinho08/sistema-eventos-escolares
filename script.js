/**
 * ARQUIVO: script.js
 * Funções de navegação e validação para todas as telas do Diário Inteligente.
 * As funções de navegação apenas simulam a troca de tela (em um ambiente real, você faria redirecionamento ou renderização SPA).
 */

 document.addEventListener('DOMContentLoaded', () => {
    // 1. Configura a navegação entre as telas
    configurarNavegacao();

    // 2. Configura a lógica específica para o formulário atual
    const bodyId = document.body.id;
    
    if (bodyId === 'tela-login') {
        configurarFormularioLogin();
    } else if (bodyId === 'tela-cadastro') {
        configurarFormularioCadastro();
    } else if (bodyId === 'tela-perfil') {
        configurarFormularioPerfil();
    }
    // As telas de dashboard e calendário geralmente não precisam de submissão de formulário simples
});

// --- FUNÇÕES DE NAVEGAÇÃO GERAIS ---

function configurarNavegacao() {
    // Liga o link "Já possui conta?" (na tela de cadastro)
    const linkLogin = document.querySelector('.link-login, .link-cadastro-login');
    if (linkLogin) {
        linkLogin.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Navegando para a tela de Login...");
            // Em uma aplicação real, você faria: window.location.href = 'login.html';
        });
    }

    // Liga o link "Não tem conta? Cadastre-se!" (na tela de login)
    const linkCadastro = document.querySelector('.link-cadastro');
    if (linkCadastro) {
        linkCadastro.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Navegando para a tela de Cadastro...");
            // Em uma aplicação real, você faria: window.location.href = 'cadastro.html';
        });
    }

    // Liga os links de navegação do menu superior (header)
    const menuLinks = document.querySelectorAll('.menu-principal a');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log(`Navegando para: ${e.target.textContent.trim()}...`);
            // Exemplo de redirecionamento em um ambiente real
            // if (e.target.textContent.includes('Calendário')) window.location.href = 'calendario.html';
        });
    });
}

// --- FUNÇÕES DE VALIDAÇÃO DE FORMULÁRIOS ---

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validarSenhas(senha1, senha2) {
    return senha1.length >= 6 && senha1 === senha2;
}

// --- LÓGICA DA TELA DE LOGIN ---

function configurarFormularioLogin() {
    const form = document.querySelector('.formulario-login');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o envio padrão
            
            const email = form.querySelector('input[type="email"]').value;
            const senha = form.querySelector('input[type="password"]').value;
            
            if (!validarEmail(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }
            
            if (senha.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres.');
                return;
            }
            
            console.log('Login bem-sucedido! E-mail:', email);
            // Em uma aplicação real, você enviaria os dados ao servidor
            // e redirecionaria para o dashboard
            alert('Login efetuado com sucesso!');
        });
    }
}

// --- LÓGICA DA TELA DE CADASTRO ---

function configurarFormularioCadastro() {
    const form = document.querySelector('.formulario-cadastro');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const nome = form.querySelector('input[type="text"][placeholder="Digite seu nome"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const telefone = form.querySelector('input[type="text"][placeholder="Digite seu telefone"]').value;
            const senha = form.querySelector('input[placeholder="Digite a senha"]').value;
            const confirmaSenha = form.querySelector('input[placeholder="Confirme a senha"]').value;
            const aceitouTermos = form.querySelector('input[type="checkbox"]').checked;
            
            if (nome.trim().length === 0 || telefone.trim().length === 0) {
                alert('Preencha todos os campos.');
                return;
            }

            if (!validarEmail(email)) {
                alert('E-mail inválido.');
                return;
            }

            if (!validarSenhas(senha, confirmaSenha)) {
                alert('As senhas não coincidem ou têm menos de 6 caracteres.');
                return;
            }
            
            if (!aceitouTermos) {
                alert('Você precisa aceitar os Termos de Uso.');
                return;
            }

            console.log('Cadastro enviado! Nome:', nome);
            alert('Cadastro efetuado com sucesso!');
        });
    }
}

// --- LÓGICA DA TELA DE PERFIL ---

function configurarFormularioPerfil() {
    const form = document.querySelector('.formulario-perfil');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Lógica de validação básica para salvar o perfil
            const email = form.querySelector('input[type="email"]').value;

            if (!validarEmail(email)) {
                alert('Por favor, verifique se o e-mail está correto.');
                return;
            }
            
            console.log('Dados do perfil salvos.');
            alert('Alterações salvas com sucesso!');
        });
    }
}