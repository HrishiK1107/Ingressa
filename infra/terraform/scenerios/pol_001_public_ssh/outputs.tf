output "instance_id" {
  value = aws_instance.public_ssh.id
}

output "security_group_id" {
  value = aws_security_group.public_ssh.id
}

output "validation_policy" {
  value = "POL-001"
}
