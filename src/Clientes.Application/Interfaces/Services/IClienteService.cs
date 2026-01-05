using Clientes.Application.DTOs;

namespace Clientes.Application.Interfaces.Services;

public interface IClienteService
{
    Task<IEnumerable<ClienteDto>> ListarClientesAsync();

    Task CriarAsync(ClienteDto cliente);

    Task AtualizarAsync(string cpfCnpj, ClienteDto cliente);

    Task ExcluirAsync(string cpfCnpj);

    Task<IEnumerable<CategoriaDto>> ListarCategoriasClientesAsync(string termo);

    Task<IEnumerable<RegiaoDto>> ListarRegioesAsync();
}
