#!/bin/bash

# Configuration
BUCKET_NAME="lifecircle-frontend"
REGION="us-east-1"  # Change this to your preferred region

# Create S3 bucket if it doesn't exist
aws s3api create-bucket \
    --bucket $BUCKET_NAME \
    --region $REGION \
    --create-bucket-configuration LocationConstraint=$REGION

# Enable static website hosting
aws s3api put-bucket-website \
    --bucket $BUCKET_NAME \
    --website-configuration '{
        "IndexDocument": {"Suffix": "index.html"},
        "ErrorDocument": {"Key": "index.html"}
    }'

# Upload files to S3
aws s3 sync . s3://$BUCKET_NAME \
    --exclude "*.git*" \
    --exclude "deploy.sh" \
    --exclude "node_modules/*" \
    --exclude "*.md" \
    --exclude ".env*" \
    --exclude "package*.json" \
    --exclude "README.md"

# Set bucket policy for public access
aws s3api put-bucket-policy \
    --bucket $BUCKET_NAME \
    --policy '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
            }
        ]
    }'

echo "Deployment completed! Your website is available at:"
echo "http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com" 