using Clientes.Application.DTOs;

namespace Clientes.Application.Mappings;

public static class ClienteMapper
{
    public static ClienteListarDto CriarDto(
        string nome,
        string fantasia,
        string cpfCnpj,
        string ieRg,
        int categoriaCodigo,
        int regiaoCodigo,
        bool ativo)
    {
        return new ClienteListarDto
        {
            Nome = nome,
            Fantasia = fantasia,
            CpfCnpj = cpfCnpj,
            IeRg = ieRg,
            CategoriaCodigo = categoriaCodigo,
            RegiaoCodigo = regiaoCodigo,
            Ativo = ativo
        };
    }
}
