using System.Net.Http.Headers;

namespace Clientes.Infrastructure.Http;

public class ApiHttpClient
{
    public static HttpClient Criar(string baseUrl)
    {
        var client = new HttpClient
        {
            BaseAddress = new Uri(baseUrl)
        };

        client.DefaultRequestHeaders.Accept
            .Add(new MediaTypeWithQualityHeaderValue("application/json"));

        return client;
    }
}
