import aiosmtplib
from email.message import EmailMessage

async def send_email(config, subject: str, to: str, html_body: str):
    message = EmailMessage()
    message["From"] = config.MAIL_USERNAME
    message["To"] = to
    message["Subject"] = subject
    message.set_content("Seu cliente de email não suporta HTML.")
    message.add_alternative(html_body, subtype="html")

    try:
        await aiosmtplib.send(
            message,
            hostname=config.MAIL_SERVER,
            port=config.MAIL_PORT,
            username=config.MAIL_USERNAME,
            password=config.MAIL_PASSWORD,
            use_tls=config.MAIL_USE_SSL,
        )
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send email to {to}: {e}")
        raise


async def send_confirmation_email(config, recipient_email: str, token: str):
    subject = "Confirm your registration"
    confirmation_link = f"http://localhost:8000/auth/confirm/{token}"
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Thanks for signing up!</h2>
            <p>Click the button below to confirm your email:</p>
            <a href="{confirmation_link}" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Confirm My Email</a>
            <p>If you did not sign up, ignore this email.</p>
        </body>
    </html>
    """
    await send_email(config, subject, recipient_email, html_body)


async def send_password_reset_email(config, email: str, reset_token: str):
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
    subject = "Recuperação de Senha"

    html_body = f"""
    <html>
        <body>
            <h2>Recuperação de Senha</h2>
            <p>Clique no link abaixo para redefinir sua senha:</p>
            <a href="{reset_link}">Redefinir Senha</a>
            <p>Este link expira em 1 hora.</p>
        </body>
    </html>
    """

    await send_email(config, subject, email, html_body)
