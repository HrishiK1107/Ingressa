output "bucket_name" {
  value = aws_s3_bucket.public_rw.bucket
}

output "validation_policy" {
  value = "POL-005"
}
