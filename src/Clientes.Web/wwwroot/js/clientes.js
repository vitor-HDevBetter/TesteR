let modal;
let preenchendoCategoria = false;
let isEdit;

function abrirModal() {
    limparModalCliente();
    isEdit = false; 

    const el = $('#modalCliente')[0];
    modal = new bootstrap.Modal(el);
    modal.show();

    carregarRegioes();
    configurarAutocompleteCategoria();
}

function abrirModalEditar(cliente) {
    limparModalCliente();

    isEdit = true;

    const el = $('#modalCliente')[0];
    modal = bootstrap.Modal.getOrCreateInstance(el);

    configurarAutocompleteCategoria();

    if (!cliente) {
        limparModalCliente();
        carregarRegioes();
        modal.show();
        return;
    }

    $('#nome').val(cliente.nome ?? '');
    $('#cpfCnpj').val(cliente.cpfCnpj ?? '');

    $('#fantasia').val(cliente.fantasia ?? '');
    $('#ieRg').val(cliente.ieRg ?? '');
    $('#ativo').prop('checked', !!cliente.ativo);

    preenchendoCategoria = true;
    $('#categoriaInput').val(cliente.categoriaDescricao ?? '');
    $('#categoriaCodigo').val(cliente.categoriaCodigo ?? '');
    $('#categoriaSugestoes').addClass('d-none').empty();
    preenchendoCategoria = false;

    carregarRegioes(cliente.regiaoCodigo);

    modal.show();
}

function carregar() {
    $.getJSON('/Clientes/ListarClientes')
        .done(function (dados) {
            const $tbody = $('#gridClientes');
            $tbody.empty();

            $.each(dados, function (_, c) {
                const $tr = $(`
                    <tr>
                        <td>${c.nome || '-'}</td>
                        <td>${c.cpfCnpj || '-'}</td>
                        <td>${c.fantasia || '-'}</td>
                        <td>${c.categoriaDescricao || '-'}</td>
                        <td>${c.regiaoDescricao || '-'}</td>
                        <td>${c.ativoDescricao || '-'}</td>
                        <td>${c.ieRg || '-'}</td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-warning me-1 btn-editar" type="button" data-regiaocodigo="${c.regiaoCodigo}" >
                                <i class="bi bi-pencil-square me-1"></i>Editar
                            </button>

                            <button class="btn btn-sm btn-danger btn-excluir" type="button"
                                    data-cpfcnpj="${c.cpfCnpj}">
                                <i class="bi bi-trash me-1"></i>Excluir
                            </button>
                        </td>
                    </tr>
                `);

                $tr.find('.btn-editar').data('cliente', c);

                $tbody.append($tr);
            });
        })
        .fail(function (xhr) {
            console.error('Erro ao carregar clientes', xhr);
        });
}

function configurarAutocompleteCategoria() {
    const $categoriaInput = $('#categoriaInput');
    const $categoriaLista = $('#categoriaSugestoes');
    const $categoriaCodigo = $('#categoriaCodigo');

    if ($categoriaInput.length === 0) return;

    $categoriaInput.off('input.autocat');
    $(document).off('click.autocat');
    $categoriaLista.off('click.autocat', 'button');

    $categoriaInput.on('input.autocat', function () {
        const termo = $.trim($categoriaInput.val());
        $categoriaCodigo.val('');

        if (termo.length < 2) {
            $categoriaLista.addClass('d-none').empty();
            return;
        }

        $.getJSON('/Clientes/ListarCategoriasClientes', { termo: termo })
            .done(function (categorias) {
                $categoriaLista.empty();

                if (!categorias || categorias.length === 0) {
                    $categoriaLista.addClass('d-none');
                    return;
                }

                $.each(categorias, function (_, cat) {
                    $categoriaLista.append(`
            <button type="button"
                    class="list-group-item list-group-item-action"
                    data-codigo="${cat.codigo}"
                    data-descricao="${cat.descricao}">
              ${cat.descricao}
            </button>
          `);
                });

                $categoriaLista.removeClass('d-none');
            })
            .fail(function (xhr) {
                console.error('Erro ao buscar categorias', xhr);
                $categoriaLista.addClass('d-none');
            });
    });

    $categoriaLista.on('click.autocat', 'button', function () {
        const $btn = $(this);
        $categoriaInput.val($btn.data('descricao'));
        $categoriaCodigo.val($btn.data('codigo'));
        $categoriaLista.addClass('d-none');
    });

    $(document).on('click.autocat', function (e) {
        if (
            !$categoriaInput.is(e.target) &&
            $categoriaInput.has(e.target).length === 0 &&
            !$categoriaLista.is(e.target) &&
            $categoriaLista.has(e.target).length === 0
        ) {
            $categoriaLista.addClass('d-none');
        }
    });
}

function carregarRegioes(regiaoSelecionada) {
    const $select = $('#regiao');

    $select
        .empty()
        .append('<option value="">Carregando...</option>')
        .prop('disabled', true);

    $.getJSON('/Clientes/ListarRegioes')
        .done(function (regioes) {
            $select.empty();

            $select.append('<option value="">Selecione a Região...</option>');

            if (!regioes || regioes.length === 0) {
                $select.append('<option value="">Nenhuma região encontrada</option>');
                return;
            }

            $.each(regioes, function (_, r) {
                $select.append(`
                    <option value="${r.codigo}">
                        ${r.descricao}
                    </option>
                `);
            });

            if (regiaoSelecionada) {
                $select.val(String(regiaoSelecionada));
            }
        })
        .fail(function (xhr) {
            console.error('Erro ao buscar regiões', xhr);
            $select
                .empty()
                .append('<option value="">Erro ao carregar regiões</option>');
        })
        .always(function () {
            $select.prop('disabled', false);
        });
}

function salvar() {
    const $categoriaCodigo = $('#categoriaCodigo');

    if (!$categoriaCodigo.val()) {
        alert('Selecione uma categoria válida.');
        return;
    }

    const cliente = {
        nome: $('#nome').val(),
        cpfCnpj: $('#cpfCnpj').val(),
        fantasia: $('#fantasia').val(),
        ieRg: $('#ieRg').val(),
        categoriaCodigo: $categoriaCodigo.val(),
        regiaoCodigo: $('#regiao').val(),
        ativo: $('#ativo').is(':checked')
    };

    $.ajax({
        url: isEdit
            ? `/Clientes/Atualizar?cpfCnpj=${encodeURIComponent(cliente.cpfCnpj)}`
            : '/Clientes/Criar',
        method: isEdit ? 'PUT' : 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(cliente)
    })
        .done(function () {
            modal?.hide();
            carregar();
        })
        .fail(function (xhr) {
            console.error('Erro ao salvar cliente', xhr);
        });
}

function excluir(cpfCnpj) {
    if (!confirm('Deseja realmente excluir este cliente?')) return;

    $.ajax({
        url: '/Clientes/Excluir',
        method: 'DELETE',
        data: { cpfCnpj: cpfCnpj }
    })
        .done(function () {
            carregar();
        })
        .fail(function (xhr) {
            console.error('Erro ao excluir cliente', xhr);
        });
}

$(document).on('click', '.btn-excluir', function () {
    excluir($(this).data('cpfcnpj'));
});

$(document).on('click', '.btn-editar', function () {
    const cliente = $(this).data('cliente');
    abrirModalEditar(cliente);
});

function limparModalCliente() {
    $('#nome, #cpfCnpj, #fantasia, #ieRg, #categoriaInput, #categoriaCodigo').val('');
    $('#categoriaSugestoes').addClass('d-none').empty();
    $('#regiao').prop('selectedIndex', 0);
    $('#ativo').prop('checked', false);
    $('#cpfCnpj').prop('disabled', false);
}



