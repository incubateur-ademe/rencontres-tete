import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Object Storage Scaleway. La lecture publique de uploads/ vient de la bucket
// policy (quartet, infra/prod/rencontres.tf), pas d'une ACL par objet.
const HOST = 's3.fr-par.scw.cloud';

const client = new S3Client({
  region: 'fr-par',
  endpoint: `https://${HOST}`,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  // Le SDK ajoute sinon un checksum que les S3 non-AWS ne gèrent pas tous.
  requestChecksumCalculation: 'WHEN_REQUIRED',
});

export async function uploadPublic(key, body, contentType) {
  const bucket = process.env.S3_BUCKET;
  await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
  return `https://${bucket}.${HOST}/${key}`;
}
