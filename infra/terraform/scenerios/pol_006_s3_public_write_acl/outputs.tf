output "bucket_name" {
  value = aws_s3_bucket.public_write_acl.id
}

output "validation_policy" {
  value = "POL-006"
}
