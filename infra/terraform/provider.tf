provider "aws" {
  profile = var.aws_profile
  region  = var.aws_region

  default_tags {
    tags = {
      owner = var.owner_tag
      ttl   = var.ttl_tag
      tool  = "ingressa-validation"
    }
  }
}
