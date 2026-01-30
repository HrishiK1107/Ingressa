provider "aws" {
  profile = "ingressa"
  region  = var.region
}

resource "aws_security_group" "public_ssh" {
  name_prefix = "ingressa-pol001-ssh-"
  description = "POL-001 validation: public SSH"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH from anywhere"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name  = "ingressa-pol001-public-ssh"
    owner = var.owner
    ttl   = var.ttl_hours
  }
}

data "aws_vpc" "default" {
  default = true
}

resource "aws_instance" "public_ssh" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"

  vpc_security_group_ids = [aws_security_group.public_ssh.id]

  associate_public_ip_address = true

  tags = {
    Name  = "ingressa-pol001-ec2"
    owner = var.owner
    ttl   = var.ttl_hours
  }
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}
