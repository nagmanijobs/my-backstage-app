var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.MapGet("/", () => Results.Ok(new
{
    service = "${{ values.name }}",
    message = "Hello from ASP.NET Core"
}));

app.MapGet("/health", () => Results.Ok(new
{
    status = "ok"
}));

app.Run();