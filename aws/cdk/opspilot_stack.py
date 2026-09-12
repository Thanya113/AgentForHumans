"""
OpsPilot AI - AWS CDK Infrastructure Definition (Python)
Deploys:
- AWS API Gateway (v2 HTTP API)
- AWS Lambda Functions (Python 3.11 with Strands Agents SDK)
- Amazon Bedrock IAM Permissions (Claude 3.5 Sonnet / Nova)
- Amazon DynamoDB Tables (Customers, Orders, Tasks, Approvals, AuditLog)
- Amazon S3 Bucket (Document Staging with KMS encryption)
- Amazon SES Rule Set for inbound support parsing
- AWS Secrets Manager for third-party ERP/accounting credentials
"""

from aws_cdk import (
    Stack,
    Duration,
    RemovalPolicy,
    aws_lambda as _lambda,
    aws_apigatewayv2_alpha as apigw,
    aws_apigatewayv2_integrations_alpha as integrations,
    aws_dynamodb as dynamodb,
    aws_s3 as s3,
    aws_iam as iam,
    aws_kms as kms,
    aws_logs as logs,
    aws_secretsmanager as secrets
)
from constructs import Construct

class OpsPilotStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # 1. KMS Customer Managed Key for encryption at rest
        kms_key = kms.Key(
            self, "OpsPilotLedgerKey",
            description="OpsPilot Audit Ledger & Document Encryption Key",
            enable_key_rotation=True
        )

        # 2. DynamoDB Tables
        customers_table = dynamodb.Table(
            self, "CustomersTable",
            table_name="OpsPilot_Customers",
            partition_key=dynamodb.Attribute(name="id", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=kms_key,
            removal_policy=RemovalPolicy.RETAIN
        )

        orders_table = dynamodb.Table(
            self, "OrdersTable",
            table_name="OpsPilot_Orders",
            partition_key=dynamodb.Attribute(name="id", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=kms_key,
            removal_policy=RemovalPolicy.RETAIN
        )

        tasks_table = dynamodb.Table(
            self, "TasksTable",
            table_name="OpsPilot_Tasks",
            partition_key=dynamodb.Attribute(name="id", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=kms_key
        )

        approvals_table = dynamodb.Table(
            self, "ApprovalsTable",
            table_name="OpsPilot_Approvals",
            partition_key=dynamodb.Attribute(name="id", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=kms_key
        )

        audit_table = dynamodb.Table(
            self, "AuditLedgerTable",
            table_name="OpsPilot_AuditLedger",
            partition_key=dynamodb.Attribute(name="id", type=dynamodb.AttributeType.STRING),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            encryption=dynamodb.TableEncryption.CUSTOMER_MANAGED,
            encryption_key=kms_key,
            point_in_time_recovery=True
        )

        # 3. S3 Bucket for Staged Operations Documents
        documents_bucket = s3.Bucket(
            self, "DocumentsBucket",
            bucket_name="opspilot-documents-staging",
            encryption=s3.BucketEncryption.KMS,
            encryption_key=kms_key,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            enforce_ssl=True,
            versioned=True,
            removal_policy=RemovalPolicy.RETAIN
        )

        # 4. Lambda Execution Role with Amazon Bedrock access
        lambda_role = iam.Role(
            self, "OpsPilotAgentLambdaRole",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name("service-role/AWSLambdaBasicExecutionRole")
            ]
        )

        # Bedrock InvokeModel Permission
        lambda_role.add_to_policy(
            iam.PolicyStatement(
                actions=[
                    "bedrock:InvokeModel",
                    "bedrock:InvokeModelWithResponseStream"
                ],
                resources=["arn:aws:bedrock:*::foundation-model/*"]
            )
        )

        # Grant table access
        customers_table.grant_read_write_data(lambda_role)
        orders_table.grant_read_write_data(lambda_role)
        tasks_table.grant_read_write_data(lambda_role)
        approvals_table.grant_read_write_data(lambda_role)
        audit_table.grant_read_write_data(lambda_role)
        documents_bucket.grant_read_write(lambda_role)

        # 5. Strands Agent AWS Lambda Function
        agent_lambda = _lambda.Function(
            self, "OpsPilotAgentFunction",
            runtime=_lambda.Runtime.PYTHON_3_11,
            code=_lambda.Code.from_asset("aws/strands_agent"),
            handler="agent.lambda_handler",
            role=lambda_role,
            timeout=Duration.seconds(90),
            memory_size=1024,
            environment={
                "BEDROCK_MODEL_ID": "anthropic.claude-3-5-sonnet-20241022-v2:0",
                "CUSTOMERS_TABLE": customers_table.table_name,
                "ORDERS_TABLE": orders_table.table_name,
                "TASKS_TABLE": tasks_table.table_name,
                "APPROVALS_TABLE": approvals_table.table_name,
                "AUDIT_TABLE": audit_table.table_name,
                "DOCUMENTS_BUCKET": documents_bucket.bucket_name,
                "AUTOMATIC_REFUND_LIMIT": "50.00"
            }
        )

        # 6. AWS API Gateway (v2 HTTP API)
        http_api = apigw.HttpApi(
            self, "OpsPilotHttpApi",
            api_name="OpsPilot-Operations-API",
            cors_preflight=apigw.CorsPreflightOptions(
                allow_origins=["*"],
                allow_methods=[apigw.CorsHttpMethod.ANY],
                allow_headers=["*"]
            )
        )

        # Add routes
        agent_integration = integrations.HttpLambdaIntegration(
            "AgentIntegration", agent_lambda
        )

        http_api.add_routes(
            path="/api/agent/run",
            methods=[apigw.HttpMethod.POST],
            integration=agent_integration
        )
