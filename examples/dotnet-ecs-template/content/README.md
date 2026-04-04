# ${{ values.name }}

This service was created from the .NET Hello World on ECS Backstage template.

## Run locally

```bash
dotnet restore
dotnet run --project src/${{ values.name }}/${{ values.name }}.csproj
```

The API listens on port `8080`.

## Endpoints

- `GET /`
- `GET /health`

## Build container image

```bash
docker build -t ${{ values.name | lower }}:local .
docker run --rm -p 8080:8080 ${{ values.name | lower }}:local
```

## Deploy to ECS

1. Create ECR repository `${{ values.ecrRepository }}` if it does not exist.
2. Build and push image to:
   `${{ values.awsAccountId }}.dkr.ecr.${{ values.awsRegion }}.amazonaws.com/${{ values.ecrRepository }}:latest`
3. Register task definition from `ecs/task-definition.json`.
4. Update ECS service `${{ values.ecsServiceName }}` in cluster `${{ values.ecsClusterName }}`.

Example commands:

```bash
aws ecs register-task-definition --cli-input-json file://ecs/task-definition.json --region ${{ values.awsRegion }}
aws ecs update-service \
  --cluster ${{ values.ecsClusterName }} \
  --service ${{ values.ecsServiceName }} \
  --force-new-deployment \
  --region ${{ values.awsRegion }}
```
