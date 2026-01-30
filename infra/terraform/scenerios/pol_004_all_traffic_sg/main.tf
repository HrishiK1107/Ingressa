provider "aws" {
  profile = "ingressa"
  region  = var.region
}

data "aws_vpc" "default" {
  default = true
}

resource "aws_security_group" "all_traffic" {
  name_prefix = "ingressa-pol004-all-traffic-"
  description = "POL-004 validation: allow all traffic"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name  = "ingressa-pol004-all-traffic"
    owner = var.owner
    ttl   = var.ttl_hours
  }
}
