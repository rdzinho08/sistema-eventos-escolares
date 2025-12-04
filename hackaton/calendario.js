/**
 * ARQUIVO: script.js
 * Versão Final Completa: Inclui navegação, persistência de dados, Mini IA e CALENDÁRIO Funcional.
 */

 let dataAtual = new Date(); // Variável global para rastrear o mês/ano atual do calendário

 document.addEventListener('DOMContentLoaded', () => {
     
     // Configura a navegação para os links de menu e rodapé em todas as páginas
     configurarNavegacaoGlobal();
     
     const bodyId = document.body.id;
     
     if (bodyId === 'tela-cadastro') {
         configurarFormularioCadastro();
     } else if (bodyId === 'tela-perfil') {
         carregarDadosPerfil(); 
     } else if (bodyId === 'tela-menu') {
         configurarMiniIA(); 
     } else if (bodyId === 'tela-calendario') {
         // NOVO: Inicializa o Calendário
         configurarCalendario();
     }
 });
 
 // --- FUNÇÕES DE NAVEGAÇÃO, VALIDAÇÃO, CADASTRO, PERFIL (Mantidas como antes) ---
 
 function configurarNavegacaoGlobal() {
     
     const links = document.querySelectorAll('.menu-principal a, .link-login, .link-cadastro');
     
     links.forEach(link => {
         link.addEventListener('click', (e) => {
             e.preventDefault();
             const href = link.getAttribute('href');
             
             if (href && href !== '#') {
                 window.location.href = href;
             } else if (href === '#') {
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
             const aceitouTermos = document.getElementById('aceito-termos').checked;
             
             if (!nome || !email || !telefone || !senha) {
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
             
             if (!aceitouTermos) {
                 alert('Você precisa aceitar os Termos de Uso.');
                 return;
             }
 
             const dadosUsuario = {
                 nomeCompleto: nome,
                 emailUsuario: email,
                 telefoneUsuario: telefone
             };
 
             localStorage.setItem('dadosUsuarioCadastrado', JSON.stringify(dadosUsuario));
 
             alert('Cadastro efetuado com sucesso! Levando você para a tela principal (Menu)...');
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
         if (inputNome) inputNome.value = 'Faça seu Cadastro!';
         if (inputEmail) inputEmail.value = 'Nenhum dado salvo.';
     }
 }
 
 // --- LÓGICA DA MINI IA (Mantida como antes) ---
 
 function configurarMiniIA() {
     const inputComando = document.getElementById('input-comando-ia');
     const btnEnviar = document.getElementById('btn-enviar-comando');
     const historico = document.getElementById('historico-eventos');
     
     let eventos = JSON.parse(localStorage.getItem('eventosEscolares')) || [];
     
     renderizarEventos();
 
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
             
             eventos.sort((a, b) => a.data.localeCompare(b.data));
             
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
 
 // ----------------------------------------------------------------------
 // --- NOVO: LÓGICA DO CALENDÁRIO FUNCIONAL (calendario.html) ---
 // ----------------------------------------------------------------------
 
 function configurarCalendario() {
     const mesAnoElemento = document.getElementById('mes-ano');
     const gridDias = document.getElementById('grid-dias');
     const btnAnterior = document.getElementById('btn-anterior');
     const btnProximo = document.getElementById('btn-proximo');
     const infoDetalhe = document.getElementById('info-detalhe');
 
     const nomesMeses = [
         "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
         "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
     ];
 
     // Carrega eventos salvos pela Mini IA
     const eventosSalvos = JSON.parse(localStorage.getItem('eventosEscolares')) || [];
 
     // Função principal para renderizar o calendário
     function renderizarCalendario() {
         const ano = dataAtual.getFullYear();
         const mes = dataAtual.getMonth();
 
         // Atualiza o título do mês/ano
         mesAnoElemento.textContent = `${nomesMeses[mes]} de ${ano}`;
         
         // Determina o primeiro dia do mês (0=Domingo, 6=Sábado)
         const primeiroDiaMes = new Date(ano, mes, 1).getDay(); 
         // Determina o último dia do mês (quantidade total de dias)
         const diasNoMes = new Date(ano, mes + 1, 0).getDate();
         
         gridDias.innerHTML = ''; // Limpa a grade
 
         // 1. Preenche dias vazios (do mês anterior)
         for (let i = 0; i < primeiroDiaMes; i++) {
             const diaVazio = document.createElement('div');
             diaVazio.classList.add('dia', 'dia-vazio');
             gridDias.appendChild(diaVazio);
         }
 
         // 2. Preenche os dias do mês atual
         for (let dia = 1; dia <= diasNoMes; dia++) {
             const diaElemento = document.createElement('div');
             diaElemento.classList.add('dia');
             diaElemento.textContent = dia;
             diaElemento.dataset.dia = dia; // Armazena o dia para referência
 
             // Formata a data atual para pesquisa nos eventos (DD/MM)
             const dataPesquisa = `${String(dia).padStart(2, '0')}/${String(mes + 1).padStart(2, '0')}`;
             
             const eventosDoDia = eventosSalvos.filter(e => e.data === dataPesquisa);
 
             // Marca o dia se houver eventos
             if (eventosDoDia.length > 0) {
                 diaElemento.classList.add('dia-com-evento');
             }
 
             // Marca o dia de hoje
             const hoje = new Date();
             if (dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) {
                 diaElemento.classList.add('dia-hoje');
             }
 
             // Adiciona o ouvinte de clique
             diaElemento.addEventListener('click', () => {
                 exibirDetalhesDoDia(dia, mes + 1, ano, eventosDoDia);
             });
 
             gridDias.appendChild(diaElemento);
         }
     }
     
     // Função para exibir os detalhes dos eventos de um dia específico
     function exibirDetalhesDoDia(dia, mes, ano, eventosDoDia) {
         const dataCompleta = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
         
         if (eventosDoDia.length > 0) {
             let detalhesHTML = `Eventos em **${dataCompleta}** (${eventosDoDia.length}):\n`;
             
             eventosDoDia.forEach(evento => {
                 detalhesHTML += `\n> ${evento.tipo.toUpperCase()}: ${evento.descricao}\n`;
             });
 
             infoDetalhe.innerHTML = detalhesHTML;
         } else {
             infoDetalhe.textContent = `Nenhum evento agendado para ${dataCompleta}.`;
         }
     }
 
     // --- Configuração dos Botões de Navegação ---
 
     btnAnterior.addEventListener('click', () => {
         dataAtual.setMonth(dataAtual.getMonth() - 1);
         renderizarCalendario();
         infoDetalhe.textContent = "Clique em um dia para ver os eventos.";
     });
 
     btnProximo.addEventListener('click', () => {
         dataAtual.setMonth(dataAtual.getMonth() + 1);
         renderizarCalendario();
         infoDetalhe.textContent = "Clique em um dia para ver os eventos.";
     });
 
     // Inicia a renderização
     renderizarCalendario();
 }