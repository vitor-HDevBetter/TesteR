using Clientes.Application.DTOs;
using Clientes.Application.Interfaces.Clients;
using Clientes.Application.Interfaces.Services;

namespace Clientes.Application.Services;

public class ClienteService : IClienteService
{
    private readonly IClienteApiClient _api;

    public ClienteService(IClienteApiClient api) => _api = api;

    public Task<IEnumerable<ClienteListarDto>> ListarClientesAsync()
        => _api.ListarClientesAsync();

    public Task CriarAsync(ClienteDto dto)
        => _api.CriarAsync(dto);

    public Task AtualizarAsync(string cpfCnpj, ClienteDto dto)
        => _api.AtualizarAsync(cpfCnpj, dto);

    public Task ExcluirAsync(string cpfCnpj)
        => _api.ExcluirAsync(cpfCnpj);

    public async Task<IEnumerable<CategoriaDto>> ListarCategoriasClientesAsync(string termo)
    {
        var categorias = await _api.ListarCategoriasClientesAsync(termo);

        return categorias
            .GroupBy(c => c.Descricao)
            .Select(g => g.First())
            .Take(10);
    }

    public Task<IEnumerable<RegiaoDto>> ListarRegioesAsync()
        => _api.ListarRegioesAsync();
}
