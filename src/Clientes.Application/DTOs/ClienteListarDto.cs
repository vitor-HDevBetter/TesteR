namespace Clientes.Application.DTOs;

public class ClienteListarDto
{
    public string Nome { get; set; } = string.Empty;
    public string Fantasia { get; set; } = string.Empty;
    public string CpfCnpj { get; set; } = string.Empty;
    public string IeRg { get; set; } = string.Empty;
    public int CategoriaCodigo { get; set; }
    public string CategoriaDescricao { get; set; } = string.Empty;
    public string RegiaoDescricao { get; set; } = string.Empty;
    public int RegiaoCodigo { get; set; }
    public bool Ativo { get; set; }
    public string AtivoDescricao { get; set; } = string.Empty;
}
