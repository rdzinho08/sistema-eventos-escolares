/**
 * ARQUIVO: eventos.js
 * Lógica para visualização, filtragem e gerenciamento da lista de eventos.
 */

 document.addEventListener('DOMContentLoaded', () => {
    if (document.body.id === 'tela-eventos') {
        configurarGerenciadorEventos();
    }
});

let todosEventos = [];
const listaEventosContainer = document.getElementById('lista-eventos');
const resumoEventosElement = document.getElementById('resumo-eventos');
const filtroTipoSelect = document.getElementById('filtro-tipo');
const btnRemoverSelecionados = document.getElementById('btn-remover-selecionados');

function configurarGerenciadorEventos() {
    carregarEventosIniciais();
    
    filtroTipoSelect.addEventListener('change', () => {
        renderizarEventos(filtroTipoSelect.value);
    });

    btnRemoverSelecionados.addEventListener('click', removerEventosSelecionados);

    // Renderiza inicialmente todos os eventos
    renderizarEventos('todos');
}

function carregarEventosIniciais() {
    try {
        const eventosSalvosJSON = localStorage.getItem('eventosEscolares');
        todosEventos = eventosSalvosJSON ? JSON.parse(eventosSalvosJSON) : [];
        
        // Garante que a data está em formato de comparação (para ordenação)
        todosEventos.sort((a, b) => {
            const [d1, m1] = a.data.split('/').map(Number);
            const [d2, m2] = b.data.split('/').map(Number);
            
            // Simplesmente compara como mm/dd (assumindo ano atual)
            if (m1 !== m2) return m1 - m2;
            return d1 - d2;
        });

    } catch (e) {
        console.error("Erro ao carregar eventos:", e);
        todosEventos = [];
    }
}

function salvarEventos() {
    localStorage.setItem('eventosEscolares', JSON.stringify(todosEventos));
    carregarEventosIniciais(); // Recarrega e ordena
}

function renderizarEventos(filtro) {
    listaEventosContainer.innerHTML = '';
    
    let eventosFiltrados = todosEventos;

    if (filtro !== 'todos') {
        eventosFiltrados = todosEventos.filter(evento => 
            evento.tipo.toLowerCase() === filtro
        );
    }
    
    resumoEventosElement.textContent = `Total de eventos: ${todosEventos.length} | Mostrando: ${eventosFiltrados.length}`;

    if (eventosFiltrados.length === 0) {
        listaEventosContainer.innerHTML = `<p class="aviso-carregando">Nenhum evento encontrado para o filtro "${filtro}".</p>`;
        return;
    }

    eventosFiltrados.forEach((evento, index) => {
        const item = document.createElement('div');
        
        // Define a classe de cor baseada no tipo (para o CSS)
        const tipoClasse = `tipo-${evento.tipo.toLowerCase()}`;
        
        item.classList.add('evento-item', tipoClasse);
        
        // Adiciona um índice de dados para identificar o evento original na lista total
        item.dataset.index = todosEventos.indexOf(evento);

        item.innerHTML = `
            <div class="evento-cabecalho">
                <strong>${evento.tipo.toUpperCase()}</strong>
                <span class="evento-data">${evento.data}</span>
            </div>
            <p class="evento-descricao">${evento.descricao}</p>
            <input type="checkbox" class="checkbox-remover" data-index="${item.dataset.index}">
        `;
        
        listaEventosContainer.appendChild(item);
    });
}

function removerEventosSelecionados() {
    const checkboxes = document.querySelectorAll('.checkbox-remover:checked');
    
    if (checkboxes.length === 0) {
        alert("Selecione pelo menos um evento para remover.");
        return;
    }

    if (!confirm(`Tem certeza que deseja remover ${checkboxes.length} evento(s)? Esta ação é irreversível!`)) {
        return;
    }

    // Coleta os índices dos eventos a serem removidos, garantindo que estejam em ordem decrescente para evitar problemas com a exclusão
    const indicesParaRemover = Array.from(checkboxes)
        .map(cb => parseInt(cb.dataset.index))
        .sort((a, b) => b - a); 

    // Remove os eventos do array principal
    indicesParaRemover.forEach(index => {
        if (index > -1 && index < todosEventos.length) {
            todosEventos.splice(index, 1);
        }
    });

    salvarEventos();
    alert(`${indicesParaRemover.length} evento(s) removido(s) com sucesso.`);
    
    // Renderiza a lista atualizada com o filtro ativo
    renderizarEventos(filtroTipoSelect.value); 
}