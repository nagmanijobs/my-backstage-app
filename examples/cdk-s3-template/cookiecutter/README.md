# {{ cookiecutter.name }}

AWS CDK TypeScript project that provisions an S3 bucket.

## Prerequisites

- Node.js 18+
- AWS credentials configured in your shell
- CDK bootstrap completed for target account/region

## Install

```bash
npm install
```

## Synthesize CloudFormation

```bash
npm run synth
```

## Deploy

```bash
npm run deploy
```

## Configured Inputs

- AWS account: `{{ cookiecutter.awsAccountId }}`
- AWS region: `{{ cookiecutter.awsRegion }}`
- Bucket name: `{{ cookiecutter.bucketName }}`
