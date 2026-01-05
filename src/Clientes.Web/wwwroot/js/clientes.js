let modal;

function abrirModal() {
    const el = $('#modalCliente')[0];
    modal = new bootstrap.Modal(el);
    modal.show();

    configurarAutocompleteCategoria();
}

function carregar() {
    const $tbody = $('#gridClientes');

    $tbody.html(`
        <tr>
            <td colspan="7" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <div class="mt-2 text-secondary">
                    Carregando clientes...
                </div>
            </td>
        </tr>
    `);

    $.getJSON('/Clientes/ListarClientes')
        .done(function (dados) {
            $tbody.empty();

            const possuiDadosValidos = dados?.some(c =>
                (c.nome && c.nome.trim() !== '') ||
                (c.cpfCnpj && c.cpfCnpj.trim() !== '')
            );

            if (!possuiDadosValidos) {
                $tbody.html(`
                    <tr>
                        <td colspan="7" class="text-center py-5 text-secondary">
                            <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                            Nenhum cliente cadastrado
                        </td>
                    </tr>
                `);
                return;
            }

            $.each(dados, function (_, c) {

                if (
                    (!c.nome || c.nome.trim() === '') &&
                    (!c.cpfCnpj || c.cpfCnpj.trim() === '')
                ) return;

                $tbody.append(`
                    <tr>
                        <td>${c.nome || '-'}</td>
                        <td>${c.fantasia || '-'}</td>
                        <td>${c.cpfCnpj || '-'}</td>
                        <td>${c.categoriaDescricao || '-'}</td>
                        <td>${c.regiaoDescricao || '-'}</td>
                        <td>${c.ativoDescricao || '-'}</td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-warning me-1"
                                    data-cpfcnpj="${c.cpfCnpj}">
                                <i class="bi bi-pencil-square me-1"></i>
                                Editar
                            </button>

                            <button class="btn btn-sm btn-danger btn-excluir"
                                    data-cpfcnpj="${c.cpfCnpj}">
                                <i class="bi bi-trash me-1"></i>
                                Excluir
                            </button>
                        </td>
                    </tr>
                `);
            });
        })
        .fail(function () {
            $tbody.html(`
                <tr>
                    <td colspan="7" class="text-center py-5 text-danger">
                        <i class="bi bi-exclamation-triangle fs-3 d-block mb-2"></i>
                        Erro ao carregar clientes
                    </td>
                </tr>
            `);
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

        $.getJSON('/Clientes/Categorias', { termo: termo })
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
        url: '/Clientes/Criar',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(cliente)
    })
        .done(function () {
            modal?.hide();
            carregar();
        })
        .fail(function (xhr) {
            console.error('Erro ao salvar cliente', xhr);
            alert('Erro ao salvar. Veja o console.');
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
            alert('Erro ao excluir. Veja o console.');
        });
}

$(document).on('click', '.btn-excluir', function () {
    excluir($(this).data('cpfcnpj'));
});

