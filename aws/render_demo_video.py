"""
OpsPilot AI - 3-Minute Video Generator
Renders a 1080p presentation video synchronized with the voiceover audio.
"""

import os
import subprocess
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

# Paths
OUTPUT_VIDEO_NO_AUDIO = "temp_video.mp4"
AUDIO_FILE = "opspilot_voiceover.mp3"
FINAL_VIDEO = "opspilot_walkthrough_demo.mp4"

WIDTH = 1920
HEIGHT = 1080
FPS = 15
TOTAL_DURATION = 176  # seconds
TOTAL_FRAMES = int(TOTAL_DURATION * FPS)

# Colors
BG_DARK = (2, 6, 23)        # slate-950
CARD_BG = (15, 23, 42)      # slate-900
BORDER_COLOR = (30, 41, 59) # slate-800
INDIGO = (99, 102, 241)     # indigo-500
CYAN = (34, 211, 238)       # cyan-400
EMERALD = (52, 211, 153)    # emerald-400
ROSE = (244, 63, 94)        # rose-500
AMBER = (251, 191, 36)      # amber-400
TEXT_WHITE = (248, 250, 252)
TEXT_MUTED = (148, 163, 184)

def get_font(size):
    try:
        # Standard Windows fonts
        return ImageFont.truetype("arial.ttf", size)
    except:
        return ImageFont.load_default()

def draw_header(draw, title, subtitle):
    # Brand Top
    draw.rectangle([(80, 50), (1840, 110)], fill=(15, 23, 42), outline=BORDER_COLOR, width=1)
    font_brand = get_font(24)
    draw.text((100, 68), "OpsPilot AI", fill=TEXT_WHITE, font=font_brand)
    font_badge = get_font(14)
    draw.rectangle([(230, 70), (270, 92)], fill=(99, 102, 241), outline=None)
    draw.text((236, 73), "AI", fill=TEXT_WHITE, font=font_badge)
    draw.text((300, 71), "Agents for Humans Hackathon  |  Professional Agents Track", fill=TEXT_MUTED, font=font_badge)
    draw.text((1580, 71), "AWS Bedrock + Strands SDK", fill=CYAN, font=font_badge)

    # Section titles
    font_title = get_font(38)
    font_sub = get_font(20)
    draw.text((80, 140), title, fill=TEXT_WHITE, font=font_title)
    draw.text((80, 190), subtitle, fill=TEXT_MUTED, font=font_sub)

def create_scene_1():
    # Title & Problem Hook
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "OpsPilot AI — Autonomous Operations Teammate", "Purpose-built for Small Businesses using Python Strands Agents SDK & Amazon Bedrock")

    # Hero Card
    draw.rectangle([(80, 250), (1840, 980)], fill=CARD_BG, outline=BORDER_COLOR, width=2)
    
    # Left Column: Problem
    font_h = get_font(28)
    font_p = get_font(20)
    draw.text((130, 300), "The Small Business Challenge", fill=AMBER, font=font_h)
    
    problems = [
        "- Repetitive, judgment-heavy operational friction consumes hundreds of hours.",
        "- Inbound damaged-order claims require photo analysis & policy lookups.",
        "- Vendor invoices must be cross-checked against Purchase Orders.",
        "- Standard chatbots merely talk without executing real actions.",
        "- Unconstrained AI bots risk financial disaster through unauthorized refunds."
    ]
    y = 360
    for p in problems:
        draw.text((130, y), p, fill=TEXT_WHITE, font=font_p)
        y += 48

    # Right Column: The Solution
    draw.rectangle([(1020, 300), (1790, 930)], fill=(2, 6, 23), outline=(99, 102, 241), width=2)
    draw.text((1060, 340), "The OpsPilot AI Solution", fill=CYAN, font=font_h)
    
    solutions = [
        "* Real End-to-End Operational Execution (Not just chat)",
        "* 9-Stage Transparent Reasoning Pipeline",
        "* Multimodal Damage Verification via Amazon Bedrock",
        "* Strict Human-in-the-Loop Safety ($50 Discretionary Limit)",
        "* Prompt Injection Isolation (<untrusted_external_data>)",
        "* Cryptographic SHA-256 Immutable Audit Ledger",
        "* Live Production on AWS + Instant Zero-AWS Preview Mode"
    ]
    y = 410
    for s in solutions:
        draw.text((1060, y), s, fill=TEXT_WHITE, font=font_p)
        y += 50

    return img

def create_scene_2():
    # 9-Stage Pipeline
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "The 9-Stage Operations Reasoning Pipeline", "Every operational task follows an explicit, transparent, and audited execution flow")

    stages = [
        ("01", "UNDERSTAND", "Ingest external email/input as untrusted data envelope", INDIGO),
        ("02", "PLAN", "Construct multi-tool execution graph via Strands SDK", INDIGO),
        ("03", "RETRIEVE", "Fetch customer, order, & policy data from DynamoDB", INDIGO),
        ("04", "REASON", "Cross-reference facts & inspect photos with Bedrock Vision", INDIGO),
        ("05", "DECIDE", "Determine authorized remediation or compensation", INDIGO),
        ("06", "APPROVE", "HUMAN-IN-THE-LOOP GATE: Halt if limit > $50", ROSE),
        ("07", "EXECUTE", "Invoke external payment, SES email, or carrier dispatch", EMERALD),
        ("08", "VERIFY", "Confirm external API success codes & dispute status", EMERALD),
        ("09", "AUDIT", "Commit SHA-256 sequenced ledger entry to DynamoDB", CYAN),
    ]

    for i, (num, name, desc, col) in enumerate(stages):
        col_idx = i % 3
        row_idx = i // 3
        x1 = 80 + col_idx * 600
        y1 = 260 + row_idx * 230
        x2 = x1 + 560
        y2 = y1 + 190
        
        draw.rectangle([(x1, y1), (x2, y2)], fill=CARD_BG, outline=col, width=2)
        font_num = get_font(18)
        font_name = get_font(26)
        font_desc = get_font(16)
        
        draw.text((x1 + 25, y1 + 20), f"STAGE {num}", fill=col, font=font_num)
        draw.text((x1 + 25, y1 + 50), name, fill=TEXT_WHITE, font=font_name)
        
        # Word wrap desc
        words = desc.split()
        lines = []
        cur = ""
        for w in words:
            if len(cur + " " + w) < 32:
                cur += " " + w
            else:
                lines.append(cur.strip())
                cur = w
        if cur: lines.append(cur.strip())
        
        for li, l in enumerate(lines):
            draw.text((x1 + 25, y1 + 100 + li * 24), l, fill=TEXT_MUTED, font=font_desc)

    return img

def create_scene_3():
    # Live Demo: Agent Workspace & Bedrock Vision
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "Live Demo: Agent Terminal & Multimodal Reasoning", "Scenario: Customer Alex Mercer reports shattered ceramic dinnerware for Order #ORD-8842")

    # Split Workspace Cards
    draw.rectangle([(80, 250), (960, 980)], fill=CARD_BG, outline=BORDER_COLOR, width=2)
    draw.rectangle([(1000, 250), (1840, 980)], fill=CARD_BG, outline=BORDER_COLOR, width=2)

    font_h = get_font(24)
    font_p = get_font(18)
    font_code = get_font(15)

    # Left: Ingestion & Bedrock Vision
    draw.text((120, 280), "1. Untrusted Input & Multimodal OCR", fill=CYAN, font=font_h)
    
    draw.rectangle([(120, 330), (920, 480)], fill=(2, 6, 23), outline=(99, 102, 241), width=1)
    draw.text((140, 345), "<untrusted_external_data>", fill=ROSE, font=font_code)
    draw.text((140, 375), "From: Alex Mercer (alex.m@example.com)", fill=TEXT_WHITE, font=font_code)
    draw.text((140, 405), "Order: ORD-8842 - Dinnerware arrived completely shattered!", fill=TEXT_WHITE, font=font_code)
    draw.text((140, 435), "</untrusted_external_data>", fill=ROSE, font=font_code)

    draw.text((120, 520), "Amazon Bedrock Multimodal Vision Analysis", fill=AMBER, font=font_h)
    draw.rectangle([(120, 565), (920, 720)], fill=(2, 6, 23), outline=BORDER_COLOR, width=1)
    draw.text((140, 585), "Model: anthropic.claude-3-5-sonnet-20241022-v2:0", fill=TEXT_MUTED, font=font_code)
    draw.text((140, 620), "Evidence File: damage_photo_ord8842.jpg (S3 Staging)", fill=TEXT_WHITE, font=font_code)
    draw.text((140, 655), "Visual Inspection: Ceramic fractures consistent with transit impact", fill=EMERALD, font=font_code)
    draw.text((140, 685), "Confidence Score: 96.8% verified", fill=EMERALD, font=font_code)

    draw.text((120, 760), "DynamoDB Records Retrieved:", fill=TEXT_WHITE, font=font_h)
    draw.text((120, 805), "- Customer: Alex Mercer (Tier: Silver, Lifetime Orders: 3, Disputes: 0%)", fill=TEXT_MUTED, font=font_p)
    draw.text((120, 845), "- Order: ORD-8842 ($120.00, Delivered 2 days ago via Carrier)", fill=TEXT_MUTED, font=font_p)
    draw.text((120, 885), "- Policy: Returns & Damage SOP Sec 4.2 (14-day warranty valid)", fill=TEXT_MUTED, font=font_p)

    # Right: Pipeline Execution
    draw.text((1040, 280), "2. Real-Time Pipeline State", fill=INDIGO, font=font_h)
    
    stages_live = [
        ("UNDERSTAND", "Neutralized prompt injection; extracted claim facts", "COMPLETED", EMERALD),
        ("PLAN", "Formulated 8-step execution graph using Strands SDK", "COMPLETED", EMERALD),
        ("RETRIEVE", "Queried get_customer and get_order tools from DynamoDB", "COMPLETED", EMERALD),
        ("REASON", "Bedrock verified damage evidence photo with 96.8% score", "COMPLETED", EMERALD),
        ("DECIDE", "Verified return policy eligibility for replacement/refund", "COMPLETED", EMERALD),
        ("APPROVE", "Claim $120.00 > $50.00 Authority Limit -> Execution Paused", "WAITING", ROSE),
    ]

    y_pos = 340
    for st, d, stat, c in stages_live:
        draw.rectangle([(1040, y_pos), (1800, y_pos + 80)], fill=(2, 6, 23), outline=c, width=1)
        draw.text((1060, y_pos + 15), st, fill=c, font=get_font(20))
        draw.text((1660, y_pos + 15), stat, fill=c, font=get_font(16))
        draw.text((1060, y_pos + 45), d, fill=TEXT_MUTED, font=font_code)
        y_pos += 95

    return img

def create_scene_4():
    # Human-in-the-Loop Approval Center
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "Live Demo: Strict Human-In-The-Loop Safety Gate", "High-risk actions exceeding discretionary limits halt execution and require supervisor sign-off")

    # Main Card
    draw.rectangle([(80, 250), (1840, 980)], fill=CARD_BG, outline=ROSE, width=2)
    
    font_h = get_font(30)
    font_p = get_font(20)
    font_code = get_font(18)

    draw.text((130, 290), "Approval Center — Escalated Action #APP-1092", fill=ROSE, font=font_h)
    
    # Details Grid
    draw.rectangle([(130, 350), (1100, 920)], fill=(2, 6, 23), outline=BORDER_COLOR, width=1)
    draw.text((160, 380), "Escalation Details & Evidence", fill=TEXT_WHITE, font=get_font(24))
    
    details = [
        ("Action Type:", "Financial Refund ($120.00)"),
        ("Customer:", "Alex Mercer (CUST-8842)"),
        ("Order Ref:", "ORD-8842 (Artisan Ceramic 16-Piece Set)"),
        ("Reason:", "Verified Transit Impact Damage to Dinnerware"),
        ("Autonomous Limit:", "$50.00 (Exceeded by $70.00)"),
        ("Risk Level:", "HIGH RISK"),
        ("Evidence 1:", "Verified damage photo photo_crack.jpg (96.8% Bedrock score)"),
        ("Evidence 2:", "Customer lifetime value: $840.00, Zero previous disputes"),
        ("Policy SOP:", "Merchant Returns & Damage Policy v3.2 Section 4.2")
    ]

    y_d = 430
    for label, val in details:
        draw.text((160, y_d), label, fill=TEXT_MUTED, font=font_code)
        c = ROSE if "HIGH" in val or "Exceeded" in val else TEXT_WHITE
        draw.text((380, y_d), val, fill=c, font=font_code)
        y_d += 48

    # Right Action Panel
    draw.rectangle([(1140, 350), (1790, 920)], fill=(2, 6, 23), outline=(99, 102, 241), width=1)
    draw.text((1180, 380), "Supervisor Sign-Off & Execution", fill=CYAN, font=get_font(24))
    
    draw.text((1180, 440), "Human Review Decisions:", fill=TEXT_MUTED, font=font_p)
    draw.text((1180, 480), "1. REJECT: Escalates for manual customer service follow-up.", fill=TEXT_WHITE, font=font_code)
    draw.text((1180, 520), "2. APPROVE: Signs off on supervisor override & authorizes refund.", fill=TEXT_WHITE, font=font_code)

    # Simulated Click
    draw.rectangle([(1180, 600), (1750, 680)], fill=EMERALD, outline=None)
    draw.text((1300, 625), "[CLICK] APPROVE ACTION", fill=(2, 6, 23), font=get_font(24))

    draw.rectangle([(1180, 720), (1750, 880)], fill=CARD_BG, outline=EMERALD, width=1)
    draw.text((1200, 740), "Execution Outcome:", fill=EMERALD, font=font_code)
    draw.text((1200, 775), "- Payment API issued refund of $120.00 to original card", fill=TEXT_WHITE, font=font_code)
    draw.text((1200, 810), "- Amazon SES dispatched polite confirmation email to Alex", fill=TEXT_WHITE, font=font_code)
    draw.text((1200, 845), "- Task status updated to 'Completed' in DynamoDB", fill=TEXT_WHITE, font=font_code)

    return img

def create_scene_5():
    # Cryptographic Audit Ledger & Mobile Responsiveness
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "Immutable SHA-256 Audit Ledger & Cross-Platform UI", "Every operational decision, tool invocation, and human sign-off is cryptographically hash-chained")

    # Left: Audit Ledger
    draw.rectangle([(80, 250), (1100, 980)], fill=CARD_BG, outline=CYAN, width=2)
    draw.text((120, 280), "Cryptographic Audit Trail (Amazon DynamoDB)", fill=CYAN, font=get_font(26))
    
    events = [
        ("AUD-90924", "Human Approved Refund ($120.00)", "sha256:8b2a4f0011c782e4...", "Alex Rivera (Lead)", EMERALD),
        ("AUD-90923", "Approval Staged: Refund > $50 Limit", "sha256:4f1a9e3381a742b1...", "Strands Agent", ROSE),
        ("AUD-90922", "Multimodal OCR Damage Verified", "sha256:c73d91bb22f8019a...", "Bedrock Claude 3.5", CYAN),
        ("AUD-90921", "Customer & Order Records Retrieved", "sha256:019f88c3ba921e54...", "Strands Tool (DynamoDB)", INDIGO),
        ("AUD-90920", "Inbound Complaint Sanitized", "sha256:3381a742b19f88c3...", "Untrusted Envelope", TEXT_MUTED),
    ]

    y_e = 350
    for aid, act, hsh, actor, c in events:
        draw.rectangle([(120, y_e), (1060, y_e + 90)], fill=(2, 6, 23), outline=BORDER_COLOR, width=1)
        draw.text((140, y_e + 15), aid, fill=TEXT_MUTED, font=get_font(16))
        draw.text((280, y_e + 15), act, fill=c, font=get_font(18))
        draw.text((140, y_e + 50), f"Hash: {hsh}", fill=TEXT_MUTED, font=get_font(14))
        draw.text((700, y_e + 50), f"Actor: {actor}", fill=TEXT_WHITE, font=get_font(14))
        y_e += 115

    # Right: Mobile & Responsive Feature Callout
    draw.rectangle([(1140, 250), (1840, 980)], fill=CARD_BG, outline=BORDER_COLOR, width=2)
    draw.text((1180, 280), "Fully Responsive Across All Devices", fill=INDIGO, font=get_font(26))

    devices = [
        ("Desktop & Laptop (1200px+)", "Full multi-column terminal, sidebar, and live metrics telemetry."),
        ("Tablet & iPad (768px - 1024px)", "Adaptive 2-column layout with fluid modal dialogs and split views."),
        ("Mobile Phones (360px - 480px)", "Slide-out navigation drawer with gesture overlay and Bottom Nav bar.")
    ]

    y_dev = 360
    for dev, desc in devices:
        draw.rectangle([(1180, y_dev), (1800, y_dev + 140)], fill=(2, 6, 23), outline=BORDER_COLOR, width=1)
        draw.text((1210, y_dev + 25), dev, fill=AMBER, font=get_font(20))
        draw.text((1210, y_dev + 70), desc, fill=TEXT_WHITE, font=get_font(16))
        y_dev += 180

    return img

def create_scene_6():
    # Architecture & Closing Pitch
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_DARK)
    draw = ImageDraw.Draw(img)
    draw_header(draw, "Production Architecture on AWS & Open Source", "Designed for the AWS Agents for Humans Hackathon | Professional Agents Track")

    draw.rectangle([(80, 250), (1840, 980)], fill=CARD_BG, outline=(99, 102, 241), width=2)
    
    font_h = get_font(32)
    font_p = get_font(22)
    font_code = get_font(18)

    draw.text((130, 300), "Serverless AWS Cloud Infrastructure", fill=CYAN, font=font_h)

    aws_services = [
        ("* Amazon Bedrock:", "Anthropic Claude 3.5 Sonnet & Amazon Nova for reasoning & multimodal vision"),
        ("* Strands Agents SDK:", "Python 3.11 orchestration engine with @tool custom business decorators"),
        ("* AWS Lambda:", "Serverless execution runtime with sub-second scaling"),
        ("* AWS API Gateway (v2):", "Secure HTTP API routing with Cognito JWT authentication"),
        ("* Amazon DynamoDB:", "5 encrypted tables for Customers, Orders, Policies, Tasks, & Audit Ledger"),
        ("* Amazon S3 + KMS:", "Document staging bucket with customer-managed key encryption"),
        ("* Amazon SES:", "Authorized operational email dispatch with domain verification")
    ]

    y_s = 370
    for s_title, s_desc in aws_services:
        draw.text((130, y_s), s_title, fill=AMBER, font=font_code)
        draw.text((420, y_s), s_desc, fill=TEXT_WHITE, font=font_code)
        y_s += 46

    # Bottom Banner
    draw.rectangle([(130, 760), (1790, 930)], fill=(2, 6, 23), outline=EMERALD, width=2)
    draw.text((170, 790), "OpsPilot AI — Real Work for Real Humans", fill=EMERALD, font=font_h)
    draw.text((170, 840), "GitHub: https://github.com/Thanya113/AgentForHumans  |  MIT Open Source License", fill=TEXT_WHITE, font=font_p)
    draw.text((170, 880), "Live Demo: https://opspilot-ai-4313.ai.studio/  |  Ready for Devpost Judging", fill=TEXT_MUTED, font=font_p)

    return img

def render_video():
    print("[*] Generating scenes...")
    scenes = [
        (0.0, 25.0, create_scene_1()),
        (25.0, 52.0, create_scene_2()),
        (52.0, 96.0, create_scene_3()),
        (96.0, 142.0, create_scene_4()),
        (142.0, 162.0, create_scene_5()),
        (162.0, 176.0, create_scene_6()),
    ]

    # Save frames or stream directly to ffmpeg pipe
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    print(f"[*] Starting video encoding with ffmpeg at {FPS} fps...")
    cmd = [
        ffmpeg_exe,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-i", AUDIO_FILE,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "medium",
        "-crf", "22",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        FINAL_VIDEO
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    for frame_idx in range(TOTAL_FRAMES):
        t = frame_idx / FPS
        current_img = scenes[-1][2]
        for start, end, s_img in scenes:
            if start <= t < end:
                current_img = s_img
                break
        
        proc.stdin.write(current_img.tobytes())
        if frame_idx % (FPS * 10) == 0:
            print(f"    Rendered {int(t)}s / {TOTAL_DURATION}s ({int(frame_idx / TOTAL_FRAMES * 100)}%)")

    proc.stdin.close()
    proc.wait()
    print(f"[OK] Video successfully generated: {FINAL_VIDEO}")

if __name__ == "__main__":
    render_video()
