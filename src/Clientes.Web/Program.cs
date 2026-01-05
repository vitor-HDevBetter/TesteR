using Clientes.Application.Interfaces.Clients;
using Clientes.Application.Interfaces.Services;
using Clientes.Application.Services;
using Clientes.Infrastructure.Clients;
using Clientes.Infrastructure.Settings;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.Configure<ApiSettings>(
    builder.Configuration.GetSection("ApiSettings")
);
builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<
        Microsoft.Extensions.Options.IOptions<ApiSettings>>().Value
);

builder.Services.AddHttpClient<IClienteApiClient, ClienteApiClient>(
    (sp, client) =>
    {
        var settings = sp.GetRequiredService<ApiSettings>();
        client.BaseAddress = new Uri(settings.BaseUrl);
    });

builder.Services.AddScoped<IClienteService, ClienteService>();

builder.Services
    .AddControllersWithViews()
    .AddRazorRuntimeCompilation();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Clientes}/{action=Index}/{id?}"
);

app.Run();
