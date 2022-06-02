#!/bin/bash
set -e
echo "Replace Value In .env.production file"
sed -i 's|NEXT_PUBLIC_BASE_URL_VALUE|'$NEXT_PUBLIC_BASE_URL'|g' .env.production
sed -i 's|NEXT_PUBLIC_CLIENT_BASIC_AUTH_TOKEN_VALUE|'$NEXT_PUBLIC_CLIENT_BASIC_AUTH_TOKEN'|g' .env.production
sed -i 's|NEXT_PUBLIC_STRIPE_P_KEY|'$NEXT_PUBLIC_STRIPE_P_KEY'|g' .env.production
sed -i 's|NEXT_PUBLIC_GOOGLE_MAP_API_KEY_VALUE|'$NEXT_PUBLIC_GOOGLE_MAP_API_KEY'|g' .env.production
sed -i 's|NEXT_PUBLIC_OPEN_API_VALUE|'$NEXT_PUBLIC_OPEN_API'|g' .env.production
sed -i 's|NEXT_PUBLIC_STAGING2_BASE_URL_VALUE|'$NEXT_PUBLIC_STAGING2_BASE_URL'|g' .env.production
sed -i 's|NEXT_PUBLIC_STAGING2_TENANT_URL_VALUE|'$NEXT_PUBLIC_STAGING2_TENANT_URL'|g' .env.production
sed -i 's|NEXT_PUBLIC_STAGING2_API_KEY_VALUE|'$NEXT_PUBLIC_STAGING2_API_KEY'|g' .env.production
sed -i 's|NEXT_PUBLIC_STAGING2_SECRET_KEY_VALUE|'$NEXT_PUBLIC_STAGING2_SECRET_KEY'|g' .env.production
echo "print file .env.production"
cat .env.production

#Install Dependency 
echo "RUN NPM CI"
npm ci

#Build Code
echo "RUN NPM BUILD"
npm run build

#Verify Build
cd  out/
echo "Check Generated Files"
ls

#Deploy to S3
echo "Code Deployed On $S3_DEV_BUCKET bucket"
export expiration='public, max-age=31536000'
aws s3 cp . s3://$S3_DEV_BUCKET/ --recursive --metadata-directive "REPLACE"  --cache-control "$expiration" --content-type "application/javascript"  --exclude "*" --include "*.js"
aws s3 cp . s3://$S3_DEV_BUCKET/ --recursive --metadata-directive "REPLACE"  --cache-control "$expiration" --content-type "application/font-sfnt"  --exclude "*" --include "*.ttf"
aws s3 cp . s3://$S3_DEV_BUCKET/ --recursive --metadata-directive "REPLACE"  --cache-control "$expiration" --content-type "application/vnd.ms-fontobject"  --exclude "*" --include "*.eot"
aws s3 cp . s3://$S3_DEV_BUCKET/ --recursive --metadata-directive "REPLACE"  --cache-control "$expiration" --content-type "application/font-woff"  --exclude "*" --include "*.woff"
aws s3 cp . s3://$S3_DEV_BUCKET/ --recursive --metadata-directive "REPLACE"  --cache-control "$expiration" --content-type "image/svg+xml"  --exclude "*" --include "*.svg"
aws s3 cp . s3://$S3_DEV_BUCKET/ --recursive --metadata-directive "REPLACE"  --cache-control "$expiration" --content-type "image/png"  --exclude "*" --include "*.png"
aws s3 cp . s3://$S3_DEV_BUCKET/ --recursive --metadata-directive "REPLACE"  --cache-control "$expiration" --content-type "text/css"  --exclude "*" --include "*.css"
aws s3 cp . s3://$S3_DEV_BUCKET/ --recursive --metadata-directive "REPLACE"  --cache-control "$expiration" --content-type "text/html" --cache-control "no-cache" --exclude "*" --include "*.html"
aws s3 cp . s3://$S3_DEV_BUCKET/ --recursive --metadata-directive "REPLACE"  --cache-control "$expiration" --content-type "image/x-icon"  --exclude "*" --include "*.ico"
aws s3 cp . s3://$S3_DEV_BUCKET/ --recursive --metadata-directive "REPLACE"  --cache-control "$expiration" --content-type "image/jpg"  --exclude "*" --include "*.jpg"
echo "Finish"
