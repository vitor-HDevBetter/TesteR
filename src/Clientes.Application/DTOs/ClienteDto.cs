namespace Clientes.Application.DTOs;

public class ClienteDto
{
    public string nome { get; set; } = string.Empty;
    public string fantasia { get; set; } = string.Empty;
    public string cnpj_cpf { get; set; } = string.Empty;
    public string ie_rg { get; set; } = string.Empty;
    public int categoria_codigo { get; set; }
    public int regiao_codigo { get; set; }
    public bool ativo { get; set; }
}
