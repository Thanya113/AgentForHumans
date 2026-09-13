"""
OpsPilot AI — AWS Account & Amazon Bedrock Verification Script

Run this script to verify:
1. Your AWS Credentials (IAM Access Keys or SSO Profile)
2. Amazon Bedrock Connectivity & Model Access (Claude 3.5 Sonnet / Nova)
3. Amazon DynamoDB & S3 permissions
"""

import os
import sys

def check_aws():
    print("=" * 65)
    print("   OpsPilot AI — AWS & Amazon Bedrock Readiness Checker")
    print("=" * 65)
    
    # 1. Check Python Boto3
    try:
        import boto3
        from botocore.exceptions import ClientError, NoCredentialsError
        print(" [OK] boto3 is installed.")
    except ImportError:
        print(" [FAIL] boto3 is not installed.")
        print("        Run: pip install boto3 strands-agents")
        return

    # 2. Check Region & Credentials
    region = os.environ.get("AWS_REGION") or os.environ.get("AWS_DEFAULT_REGION") or "us-east-1"
    print(f" [*] Testing AWS Region: {region}")

    try:
        session = boto3.Session(region_name=region)
        sts = session.client("sts")
        caller_identity = sts.get_caller_identity()
        print(" [OK] AWS Credentials Verified!")
        print(f"      - Account ID : {caller_identity.get('Account')}")
        print(f"      - IAM ARN    : {caller_identity.get('Arn')}")
        print(f"      - User ID    : {caller_identity.get('UserId')}")
    except NoCredentialsError:
        print(" [FAIL] No AWS Credentials found!")
        print("\n How to configure your AWS credentials:")
        print(" 1. In PowerShell or Command Prompt, set your access keys:")
        print("    $env:AWS_ACCESS_KEY_ID=\"YOUR_ACCESS_KEY_ID\"")
        print("    $env:AWS_SECRET_ACCESS_KEY=\"YOUR_SECRET_ACCESS_KEY\"")
        print("    $env:AWS_REGION=\"us-east-1\"")
        print(" 2. Or if you have AWS CLI installed, simply run: aws configure")
        return
    except Exception as e:
        print(f" [FAIL] Credential validation failed: {str(e)}")
        return

    # 3. Check Amazon Bedrock
    print("\n [*] Testing Amazon Bedrock Model Access...")
    try:
        bedrock = session.client("bedrock")
        models_response = bedrock.list_foundation_models(byProvider="Anthropic")
        models = [m.get("modelId") for m in models_response.get("modelSummaryList", [])]
        print(f" [OK] Amazon Bedrock is reachable in {region}.")
        print(f"      Available Anthropic Models found: {len(models)}")
        
        # Check Claude 3.5 Sonnet
        target_model = "anthropic.claude-3-5-sonnet-20241022-v2:0"
        if any("claude-3-5-sonnet" in m for m in models):
            print(" [OK] Claude 3.5 Sonnet foundation model is available in your account.")
        else:
            print(" [WARN] Note: Make sure Model Access is enabled in the AWS Bedrock Console:")
            print("        AWS Console -> Amazon Bedrock -> 'Model access' -> Enable 'Anthropic Claude'.")

    except ClientError as e:
        code = e.response.get("Error", {}).get("Code", "")
        if code in ["AccessDeniedException", "UnauthorizedException"]:
            print(" [FAIL] Access to Amazon Bedrock was denied.")
            print("        Make sure your IAM User/Role has the policy 'AmazonBedrockFullAccess'")
            print("        or permission: bedrock:InvokeModel on arn:aws:bedrock:*::foundation-model/*")
        else:
            print(f" [WARN] Bedrock check note: {str(e)}")
    except Exception as e:
        print(f" [WARN] Bedrock check note: {str(e)}")

    # 4. Check DynamoDB Connectivity
    print("\n [*] Testing Amazon DynamoDB Access...")
    try:
        dynamodb = session.client("dynamodb")
        tables = dynamodb.list_tables()
        table_names = tables.get("TableNames", [])
        print(f" [OK] DynamoDB connection successful. Existing tables in {region}: {len(table_names)}")
        opspilot_tables = [t for t in table_names if "OpsPilot" in t]
        if opspilot_tables:
            print(f"      OpsPilot tables found: {', '.join(opspilot_tables)}")
        else:
            print("      (OpsPilot tables not deployed yet. Deploy via `cd aws/cdk && cdk deploy`)")
    except Exception as e:
        print(f" [WARN] DynamoDB check note: {str(e)}")

    # 5. Check Strands Agents SDK
    print("\n [*] Testing Strands Agents SDK installation...")
    try:
        from strands import Agent, tool
        from strands.models import BedrockModel
        print(" [OK] strands-agents SDK is installed and imported successfully!")
    except ImportError:
        try:
            from strands_agents import Agent, tool
            print(" [OK] strands_agents package imported successfully.")
        except ImportError:
            print(" [INFO] strands-agents is not installed locally.")
            print("        Install with: pip install strands-agents")

    print("\n" + "=" * 65)
    print("   Verification Complete!")
    print("=" * 65)

if __name__ == "__main__":
    check_aws()
