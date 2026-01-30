provider "aws" {
  profile = "ingressa"
  region  = var.region
}

# ----------------------------
# Account-level: allow ACLs
# ----------------------------
resource "aws_s3_account_public_access_block" "allow_acls" {
  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = true
  restrict_public_buckets = true
}

# ----------------------------
# Bucket
# ----------------------------
resource "aws_s3_bucket" "public_write_acl" {
  bucket_prefix = "ingressa-pol006-public-write-acl-"

  tags = {
    Name  = "ingressa-pol006-public-write-acl"
    owner = var.owner
    ttl   = var.ttl_hours
  }
}

# ----------------------------
# ENABLE ACLs (Object Ownership)
# ----------------------------
resource "aws_s3_bucket_ownership_controls" "allow_acls" {
  bucket = aws_s3_bucket.public_write_acl.id

  rule {
    object_ownership = "ObjectWriter"
  }
}

# ----------------------------
# Bucket-level public access
# ----------------------------
resource "aws_s3_bucket_public_access_block" "allow_acls" {
  bucket = aws_s3_bucket.public_write_acl.id

  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = true
  restrict_public_buckets = true

  depends_on = [
    aws_s3_account_public_access_block.allow_acls,
    aws_s3_bucket_ownership_controls.allow_acls
  ]
}

# ----------------------------
# Dangerous ACL (POL-006)
# ----------------------------
resource "aws_s3_bucket_acl" "public_write" {
  bucket = aws_s3_bucket.public_write_acl.id
  acl    = "authenticated-read"

  depends_on = [
    aws_s3_bucket_public_access_block.allow_acls
  ]
}
