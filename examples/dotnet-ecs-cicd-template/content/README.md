# ${{ values.name }}

This repository contains a reusable GitHub Actions CI/CD workflow for deploying a .NET service to Amazon ECS.

## What it deploys

- Source repository: `${{ values.serviceRepoName }}`
- ECR image: `${{ values.awsAccountId }}.dkr.ecr.${{ values.awsRegion }}.amazonaws.com/${{ values.ecrRepository }}`
- ECS cluster/service: `${{ values.ecsClusterName }}/${{ values.ecsServiceName }}`

## Files

- `.github/workflows/deploy-ecs.yml`: Build and deploy workflow
- `ecs/task-definition.json`: ECS Fargate task definition template

## Prerequisites

1. GitHub OIDC trust configured in AWS IAM for role:
   `${{ values.awsRoleArn }}`
2. Role permissions for ECR push and ECS deploy.
3. Existing ECS service `${{ values.ecsServiceName }}` in cluster `${{ values.ecsClusterName }}`.
4. Existing ECR repository `${{ values.ecrRepository }}`.

## How to use

1. Copy `.github/workflows/deploy-ecs.yml` and `ecs/task-definition.json` into your .NET service repo (`${{ values.serviceRepoName }}`).
2. Push to `main` branch or run workflow manually from GitHub Actions UI.
