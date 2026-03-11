package storage

import (
	"context"
	"fmt"
	"io"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type MinioClient struct {
	client *minio.Client
}

func NewMinioClient(endpoint, accessKey, secretKey string) (*MinioClient, error) {
	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: false,
	})
	if err != nil {
		return nil, fmt.Errorf("creating MinIO client: %w", err)
	}

	return &MinioClient{client: client}, nil
}

func (m *MinioClient) CreateBucket(ctx context.Context, name string) error {
	exists, err := m.client.BucketExists(ctx, name)
	if err != nil {
		return fmt.Errorf("checking bucket %s: %w", name, err)
	}
	if exists {
		return nil
	}

	if err := m.client.MakeBucket(ctx, name, minio.MakeBucketOptions{}); err != nil {
		return fmt.Errorf("creating bucket %s: %w", name, err)
	}
	return nil
}

func (m *MinioClient) Upload(ctx context.Context, bucket, object string, reader io.Reader, size int64, contentType string) error {
	_, err := m.client.PutObject(ctx, bucket, object, reader, size, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return fmt.Errorf("uploading %s/%s: %w", bucket, object, err)
	}
	return nil
}
