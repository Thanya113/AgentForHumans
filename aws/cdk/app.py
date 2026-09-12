#!/usr/bin/env python3
import os
import aws_cdk as cdk
from opspilot_stack import OpsPilotStack

app = cdk.App()
OpsPilotStack(
    app, "OpsPilotStack",
    env=cdk.Environment(
        account=os.getenv("CDK_DEFAULT_ACCOUNT"),
        region=os.getenv("CDK_DEFAULT_REGION", "us-east-1")
    ),
    description="OpsPilot AI - Autonomous Operations Agent Infrastructure Stack"
)

app.synth()
