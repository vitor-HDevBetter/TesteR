using Clientes.Application.DTOs;
using Clientes.Application.Interfaces.Services;
using Clientes.Web.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Clientes.Web.Controllers;

public class ClientesController : Controller
{
    private readonly IClienteService _service;

    public ClientesController(IClienteService service) => _service = service;

    public IActionResult Index()
    {
        return View();
    }

    public async Task<IActionResult> ListarClientes()
    {
        var clientes = await _service.ListarClientesAsync();
        return Json(clientes);
    }

    public async Task<IActionResult> ListarCategoriasClientes(string termo)
    {
        var categorias = await _service.ListarCategoriasClientesAsync(termo ?? string.Empty);
        return Json(categorias);
    }

    public async Task<IActionResult> ListarRegioes()
    {
        var regioes = await _service.ListarRegioesAsync();
        return Json(regioes);
    }

    public async Task<IActionResult> Criar([FromBody] ClienteViewModel model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var dto = new ClienteDto
        {
            nome = model.Nome,
            fantasia = model.Fantasia,
            cnpj_cpf = model.CpfCnpj,
            ie_rg = model.IeRg,
            categoria_codigo = model.CategoriaCodigo,
            regiao_codigo = model.RegiaoCodigo,
            ativo = model.Ativo
        };

        await _service.CriarAsync(dto);
        return Ok();
    }

    public async Task<IActionResult> Atualizar(string cpfCnpj, [FromBody] ClienteViewModel model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var dto = new ClienteDto
        {
            nome = model.Nome,
            fantasia = model.Fantasia,
            cnpj_cpf = model.CpfCnpj,
            ie_rg = model.IeRg,
            categoria_codigo = model.CategoriaCodigo,
            regiao_codigo = model.RegiaoCodigo,
            ativo = model.Ativo
        };

        await _service.AtualizarAsync(cpfCnpj, dto);
        return Ok();
    }

    public async Task<IActionResult> Excluir(string cpfCnpj)
    {
        if (string.IsNullOrWhiteSpace(cpfCnpj)) return BadRequest("CPF/CNPJ inválido.");

        await _service.ExcluirAsync(cpfCnpj);
        return Ok();
    }
}
