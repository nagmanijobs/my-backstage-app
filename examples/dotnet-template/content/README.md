# ${{ values.name }}

This service was created from the example .NET Backstage template.

## Run locally

```bash
dotnet restore
dotnet run --project src/${{ values.name }}/${{ values.name }}.csproj
```

## Endpoints

- `GET /health`
- `GET /`