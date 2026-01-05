namespace Clientes.Web.ViewModels;

public class ClienteViewModel
{
    public string Nome { get; set; } = string.Empty;
    public string Fantasia { get; set; } = string.Empty;
    public string CpfCnpj { get; set; } = string.Empty;
    public string IeRg { get; set; } = string.Empty;
    public int CategoriaCodigo { get; set; }
    public int RegiaoCodigo { get; set; }
    public bool Ativo { get; set; }
}
