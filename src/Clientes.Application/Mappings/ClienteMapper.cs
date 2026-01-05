using Clientes.Application.DTOs;

namespace Clientes.Application.Mappings;

public static class ClienteMapper
{
    public static ClienteDto CriarDto(
        string nome,
        string fantasia,
        string cpfCnpj,
        string ieRg,
        int categoriaCodigo,
        int regiaoCodigo,
        bool ativo)
    {
        return new ClienteDto
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
