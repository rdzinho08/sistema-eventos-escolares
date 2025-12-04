/**
 * ARQUIVO: script.js
 * Lógica CENTRAL: Navegação, Cadastro (Redireciona para Menu), Perfil, Login e Mini IA.
 */

 document.addEventListener('DOMContentLoaded', () => {
    
    configurarNavegacaoGlobal();
    
    const bodyId = document.body.id;
    
    if (bodyId === 'tela-cadastro') {
        configurarFormularioCadastro();
    } else if (bodyId === 'tela-perfil') {
        carregarDadosPerfil(); 
    } else if (bodyId === 'tela-menu') {
        configurarMiniIA(); 
    } else if (bodyId === 'tela-login') {
        configurarFormularioLogin();
    }
});

// --- FUNÇÕES DE NAVEGAÇÃO, VALIDAÇÃO, CADASTRO, PERFIL ---

function configurarNavegacaoGlobal() {
    
    const links = document.querySelectorAll('.menu-principal a, .link-login, .link-cadastro');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.getAttribute('href') === '#') {
                 e.preventDefault();
                 alert('A tela de Eventos (ou link desativado) ainda não está pronta!');
            }
        });
    });
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validarSenhas(senha1, senha2) {
    return senha1.length >= 6 && senha1 === senha2;
}

function configurarFormularioCadastro() {
    const form = document.getElementById('form-cadastro');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const nome = document.getElementById('campo-nome').value;
            const email = document.getElementById('campo-email').value;
            const telefone = document.getElementById('campo-telefone').value;
            const senha = document.getElementById('campo-senha').value;
            const confirmaSenha = document.getElementById('campo-confirma-senha').value;
            const aceitouTermos = document.getElementById('aceito-termos')?.checked;
            
            if (!nome || !email || !senha || !confirmaSenha) {
                alert('Preencha todos os campos obrigatórios.');
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
            
            if (aceitouTermos === false) { 
                alert('Você precisa aceitar os Termos de Uso.');
                return;
            }

            const dadosUsuario = {
                nomeCompleto: nome,
                emailUsuario: email,
                telefoneUsuario: telefone 
            };

            localStorage.setItem('dadosUsuarioCadastrado', JSON.stringify(dadosUsuario));

            // REDIRECIONAMENTO CORRIGIDO: Cadastro leva para o Menu
            alert('Cadastro efetuado com sucesso! Redirecionando para o Menu principal...');
            window.location.href = 'menu.html'; 
        });
    }
}

function carregarDadosPerfil() {
    const dadosSalvosJSON = localStorage.getItem('dadosUsuarioCadastrado');

    if (dadosSalvosJSON) {
        try {
            const dadosUsuario = JSON.parse(dadosSalvosJSON);
            
            const inputNome = document.getElementById('perfil-nome');
            const inputEmail = document.getElementById('perfil-email');
            const inputTelefone = document.getElementById('perfil-telefone');

            if (inputNome) inputNome.value = dadosUsuario.nomeCompleto || 'Nome não encontrado';
            if (inputEmail) inputEmail.value = dadosUsuario.emailUsuario || 'Email não encontrado';
            if (inputTelefone) inputTelefone.value = dadosUsuario.telefoneUsuario || 'Telefone não encontrado';
            
        } catch (e) {
            console.error("Erro ao processar dados salvos:", e);
        }
    } else {
        const inputNome = document.getElementById('perfil-nome');
        const inputEmail = document.getElementById('perfil-email');
        if (inputNome) inputNome.value = 'Nenhum Cadastro Localizado';
        if (inputEmail) inputEmail.value = 'Redirecione para o Login/Cadastro.';
    }
}

// --- LÓGICA DE LOGIN ---

function configurarFormularioLogin() {
    const formLogin = document.getElementById('form-login');

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const emailDigitado = document.getElementById('campo-email').value;
            
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

// --- LÓGICA DA MINI IA ---

function configurarMiniIA() {
    const inputComando = document.getElementById('input-comando-ia');
    const btnEnviar = document.getElementById('btn-enviar-comando');
    const historico = document.getElementById('historico-eventos');
    
    let eventos = JSON.parse(localStorage.getItem('eventosEscolares')) || [];
    
    renderizarEventos();
    
    // Adiciona evento aos botões rápidos
    document.querySelectorAll('.comandos-rapidos button').forEach(button => {
        button.addEventListener('click', () => {
            inputComando.value = button.dataset.comando;
            processarComando();
        });
    });

    function adicionarMensagem(texto, classe) {
        const p = document.createElement('p');
        p.innerHTML = texto; 
        p.classList.add(classe);
        historico.appendChild(p);
        historico.scrollTop = historico.scrollHeight; 
    }

    function renderizarEventos() {
        historico.innerHTML = '';
        adicionarMensagem("🤖 **Pronto para organizar sua agenda!** Use os Comandos Rápidos abaixo ou digite 'ajuda'.", "resposta-ia");

        if (eventos.length > 0) {
            
            eventos.sort((a, b) => {
                const [d1, m1] = a.data.split('/').map(Number);
                const [d2, m2] = b.data.split('/').map(Number);
                
                if (m1 !== m2) return m1 - m2;
                return d1 - d2;
            });
            
            adicionarMensagem("🗓️ **Seus Próximos Eventos:**", "resposta-ia");
            
            eventos.forEach((evento, index) => {
                adicionarMensagem(`- **#${index + 1}** (${evento.data}): ${evento.tipo} - ${evento.descricao}`, "evento-salvo");
            });
        } else {
            adicionarMensagem("🎉 Sua agenda está vazia. Comece adicionando um evento!", "resposta-ia");
        }
    }

    function processarComando() {
        const comando = inputComando.value.trim();
        if (comando === "") return;

        adicionarMensagem(comando, "mensagem-usuario");
        inputComando.value = ''; 

        const comandoLowerCase = comando.toLowerCase();
        
        if (comandoLowerCase === 'mostrar agenda' || comandoLowerCase === 'ver eventos') {
            renderizarEventos();
            return;
        }
        
        if (comandoLowerCase === 'ajuda' || comandoLowerCase === 'comandos') {
            adicionarMensagem("✨ **Comandos:** 1. `Adicionar [tipo] [descrição] dia [dd/mm]` | 2. `Remover [número do evento]` | 3. `Mostrar agenda` | 4. `Limpar tudo`", "resposta-ia");
            return;
        }
        
        if (comandoLowerCase === 'limpar tudo' || comandoLowerCase === 'remover todos') {
             eventos = [];
             localStorage.removeItem('eventosEscolares');
             adicionarMensagem("🗑️ **CONFIRMADO!** Todos os eventos foram apagados. Sua agenda está zerada.", "resposta-ia");
             renderizarEventos();
             return;
        }

        const regexAdicionar = /(adicionar|incluir)\s+(.*?)\s+dia\s+(\d{1,2}\/\d{1,2})/i;
        let match = comando.match(regexAdicionar);

        if (match) {
            const descricaoCompleta = match[2].trim();
            const data = match[3].trim();
            
            const tipoMatch = descricaoCompleta.match(/^(prova|trabalho|reuniao|lembrete|aula|exame)/i);
            const tipo = tipoMatch ? tipoMatch[0] : 'Evento';

            const novoEvento = { tipo: tipo, descricao: descricaoCompleta, data: data };
            
            eventos.push(novoEvento);
            localStorage.setItem('eventosEscolares', JSON.stringify(eventos));
            
            adicionarMensagem(`✅ **Adicionado!** ${tipo} (${data}) salvo.`, "resposta-ia"); 
            return;
        }
        
        const regexRemover = /(remover|apagar|excluir)\s+(\d+)/i;
        match = comando.match(regexRemover);

        if (match) {
            const indexRemover = parseInt(match[2]) - 1; 

            if (indexRemover >= 0 && indexRemover < eventos.length) {
                const eventoRemovido = eventos.splice(indexRemover, 1)[0];
                localStorage.setItem('eventosEscolares', JSON.stringify(eventos));
                adicionarMensagem(`➖ **Removido!** O evento #${match[2]} (${eventoRemovido.tipo} - ${eventoRemovido.data}) foi excluído.`, "resposta-ia");
            } else {
                adicionarMensagem("❌ **Erro:** O número do evento não existe. Use 'Mostrar agenda' para ver a lista.", "resposta-ia");
            }
            return;
        }

        adicionarMensagem("🤔 **Não entendi.** Meu cérebro digital ainda está aprendendo. Digite 'ajuda' para ver os comandos válidos.", "resposta-ia");
    }

    btnEnviar.addEventListener('click', processarComando); 
    inputComando.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processarComando();
        }
    });
}