using Clientes.Application.DTOs;

namespace Clientes.Application.Interfaces.Clients;

public interface IClienteApiClient
{
    Task<IEnumerable<ClienteListarDto>> ListarClientesAsync();

    Task CriarAsync(ClienteDto dto);

    Task AtualizarAsync(string cpfCnpj, ClienteDto dto);

    Task ExcluirAsync(string cpfCnpj);

    Task<IEnumerable<CategoriaDto>> ListarCategoriasClientesAsync(string termo);

    Task<IEnumerable<RegiaoDto>> ListarRegioesAsync();
}
