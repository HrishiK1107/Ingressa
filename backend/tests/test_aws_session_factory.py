from app.collectors.aws_session import AWSSessionFactory


def test_aws_session_factory_constructs():
    fac = AWSSessionFactory(region="ap-south-1")
    # just ensures no crash on creation
    assert fac.region == "ap-south-1"
