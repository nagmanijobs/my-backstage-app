import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

interface S3BucketStackProps extends cdk.StackProps {
  bucketName: string;
}

export class S3BucketStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: S3BucketStackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'Bucket', {
      bucketName: props.bucketName,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      enforceSSL: true,
    });
  }
}
