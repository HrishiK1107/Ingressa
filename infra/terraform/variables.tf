variable "aws_profile" {
  description = "AWS CLI profile name"
  type        = string
}

variable "aws_region" {
  description = "AWS region for validation"
  type        = string
  default     = "ap-south-1"
}

variable "owner_tag" {
  description = "Owner tag for cleanup safety"
  type        = string
}

variable "ttl_tag" {
  description = "TTL tag (ISO or hours)"
  type        = string
}
