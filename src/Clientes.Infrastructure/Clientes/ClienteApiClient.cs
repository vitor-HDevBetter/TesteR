using Clientes.Application.DTOs;
using Clientes.Application.Interfaces.Clients;
using Clientes.Infrastructure.Settings;
using System.Net.Http.Json;

namespace Clientes.Infrastructure.Clients;

public class ClienteApiClient : IClienteApiClient
{
    private readonly HttpClient _http;
    private readonly ApiSettings _settings;

    public ClienteApiClient(HttpClient http, ApiSettings settings)
    {
        _http = http;
        _settings = settings;
    }

    public async Task<IEnumerable<ClienteDto>> ListarClientesAsync() =>
        await _http.GetFromJsonAsync<IEnumerable<ClienteDto>>(
            $"/webhook/cadastro_cliente?api_key={_settings.ApiKey}") ?? [];

    public async Task CriarAsync(ClienteDto dto) =>
        await _http.PostAsJsonAsync(
            $"/webhook/cadastro_cliente?api_key={_settings.ApiKey}", dto);

    public async Task AtualizarAsync(string cpfCnpj, ClienteDto dto) =>
        await _http.PutAsJsonAsync(
            $"/webhook/cadastro_cliente?cpf_cnpj={cpfCnpj}&api_key={_settings.ApiKey}", dto);

    public async Task ExcluirAsync(string cpfCnpj) =>
        await _http.DeleteAsync($"/webhook/cadastro_cliente?cpf_cnpj={cpfCnpj}&api_key={_settings.ApiKey}");

    public async Task<IEnumerable<CategoriaDto>> ListarCategoriasClientesAsync(string termo)
    {
        var lista = await _http.GetFromJsonAsync<IEnumerable<CategoriaDto>>(
            $"/webhook/categorias_cliente?api_key={_settings.ApiKey}");

        return lista?.Where(x => x.Descricao.Contains(termo, StringComparison.OrdinalIgnoreCase)) ?? [];
    }

    public async Task<IEnumerable<RegiaoDto>> ListarRegioesAsync() =>
        await _http.GetFromJsonAsync<IEnumerable<RegiaoDto>>($"/webhook/regioes_cliente?api_key={_settings.ApiKey}") ?? [];
}
