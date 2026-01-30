output "security_group_id" {
  value = aws_security_group.all_traffic.id
}

output "validation_policy" {
  value = "POL-004"
}
