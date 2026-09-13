# Script to generate the 3-minute professional voiceover audio file
Add-Type -AssemblyName System.Speech
$synthesizer = New-Object System.Speech.Synthesis.SpeechSynthesizer

# Select high quality English voice (Zira or David)
$voices = $synthesizer.GetInstalledVoices()
$voiceName = ($voices | Where-Object { $_.VoiceInfo.Name -like "*Zira*" } | Select-Object -First 1).VoiceInfo.Name
if (-not $voiceName) {
    $voiceName = ($voices | Select-Object -First 1).VoiceInfo.Name
}
$synthesizer.SelectVoice($voiceName)

# Set natural speaking rate (-1 for clear, deliberate, authoritative speed)
$synthesizer.Rate = -1
$synthesizer.Volume = 100

$outputPath = Join-Path $PSScriptRoot "..\opspilot_3min_voiceover.wav"
$synthesizer.SetOutputToWaveFile($outputPath)

$scriptText = @"
Welcome to OpsPilot AI, the autonomous operations teammate built for small businesses and growing enterprises, powered by the Python Strands Agents SDK and Amazon Bedrock.

Small business owners lose hundreds of hours every month dealing with repetitive, judgment-heavy operational friction: inspecting damaged-goods claims, reconciling vendor invoice discrepancies, and managing customer inquiries. Standard conversational chatbots are unhelpful because they just talk without executing real work, while unconstrained autonomous agents risk financial disaster by issuing unauthorized refunds.

OpsPilot AI solves this end-to-end. It takes on real business operations, handling them across an explicit nine-stage pipeline: Understand, Plan, Retrieve, Reason, Decide, Approve, Execute, Verify, and Audit.

Let's see it in action in our Agent Workspace.
A customer, Alex Mercer, reports shattered plates for order ORD-8842. The agent ingests the complaint within an untrusted data envelope to neutralize prompt injection attacks. Next, it retrieves the customer profile and order details from Amazon DynamoDB. Using Amazon Bedrock multimodal vision, it inspects the uploaded damage photo and confirms transit impact damage with ninety-seven percent confidence.

Now notice our safety boundary:
The return policy allows remediation, but the claim is one hundred and twenty dollars. Because this exceeds our fifty-dollar discretionary authority limit, OpsPilot AI halts execution at the Approve stage and stages a review in our Approval Center.

Switching to the Approval Center:
Here, the operations manager sees the pending claim, the order history, and photographic evidence. If we decline, the task escalates for manual customer follow-up. But when we click Approve, the agent securely processes the refund and logs the supervisor's signed notes.

Every single decision, policy check, and tool invocation is hashed with SHA-256 and committed to an immutable cryptographic audit ledger in DynamoDB. This guarantees total compliance, transparency, and auditability.

OpsPilot AI is purpose-built for AWS, featuring Amazon Bedrock with Claude 3.5 Sonnet, AWS Lambda, API Gateway, DynamoDB, and Amazon SES. It runs out of the box with a high-fidelity preview mode, and is fully responsive on mobile, tablet, and desktop.

OpsPilot AI. Real autonomous operations for real human teams. Thank you!
"@

$synthesizer.Speak($scriptText)
$synthesizer.Dispose()

Write-Host "Voiceover generated successfully at: $outputPath"
