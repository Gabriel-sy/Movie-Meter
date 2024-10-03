using System.Text.Json;
using MovieMeter.Application.Models;

namespace MovieMeter.API.Extensions;

public static class HttpExtensions
{
    //O "this" faz com que esse método vire um método do HttpResponse.
    public static void AddPaginationHeader(this HttpResponse response, PaginationHeader header)
    {
        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        response.Headers.Add("Pagination", JsonSerializer.Serialize(header, jsonOptions));
        //Para expor o header Pagination para o front.
        response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
    }
}