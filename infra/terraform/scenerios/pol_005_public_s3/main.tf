provider "aws" {
  profile = "ingressa"
  region  = var.region
}

# -------------------------------
# ❌ Disable ACCOUNT-level S3 BPA
# -------------------------------
resource "aws_s3_account_public_access_block" "disable_account_block" {
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# -------------------------------
# S3 Bucket
# -------------------------------
resource "aws_s3_bucket" "public_rw" {
  bucket_prefix = "ingressa-pol005-public-rw-"

  tags = {
    Name  = "ingressa-pol005-public-rw"
    owner = var.owner
    ttl   = var.ttl_hours
  }
}

# -------------------------------
# ❌ Disable bucket-level BPA
# -------------------------------
resource "aws_s3_bucket_public_access_block" "disable_block" {
  bucket = aws_s3_bucket.public_rw.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false

  depends_on = [
    aws_s3_account_public_access_block.disable_account_block
  ]
}

# -------------------------------
# ❌ Public Read + Write policy
# -------------------------------
resource "aws_s3_bucket_policy" "public_rw" {
  bucket = aws_s3_bucket.public_rw.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadWrite"
        Effect    = "Allow"
        Principal = "*"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "${aws_s3_bucket.public_rw.arn}/*"
      }
    ]
  })

  depends_on = [
    aws_s3_bucket_public_access_block.disable_block
  ]
}
