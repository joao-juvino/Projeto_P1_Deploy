from flask import current_app
from flask_mail import Message
from app import mail

def send_confirmation_email(recipient_email: str, token: str):
    subject = "Confirm your registration"
    sender = current_app.config['MAIL_USERNAME']
    
    confirmation_link = f"http://127.0.0.1:5000/auth/confirm/{token}"

    html_body = f"""
    <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .container {{ padding: 20px; }}
                .button {{
                    padding: 12px 25px;
                    background-color: #007BFF;
                    color: white !important; /* Important for the link */
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Thanks for signing up!</h2>
                <p>Please click the button below to confirm your email address and activate your account:</p>
                <p>
                    <a href="{confirmation_link}" class="button">Confirm My Email</a>
                </p>
                <p>If you did not sign up on our website, please ignore this email.</p>
            </div>
        </body>
    </html>
    """
    msg = Message(subject, sender=sender, recipients=[recipient_email])
    msg.html = html_body
    
    mail.send(msg)

def send_password_reset_email(email: str, reset_token: str):
    """Envia email de recuperação de senha"""
    
    # URL para reset - ajuste conforme sua aplicação
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
    
    subject = "Recuperação de Senha"
    
    html_body = f"""
    <h2>Recuperação de Senha</h2>
    <p>Clique no link abaixo para redefinir sua senha:</p>
    <p><a href="{reset_link}">Redefinir Senha</a></p>
    <p>Este link expira em 1 hora.</p>
    <p>Se você não solicitou isso, ignore este email.</p>
    """
    
    text_body = f"""
    Recuperação de Senha
    
    Clique no link para redefinir sua senha:
    {reset_link}
    
    Este link expira em 1 hora.
    """
    
    # Use sua função de envio existente
    # Exemplo: send_email(email, subject, html_body, text_body)
    print(f"Email enviado para {email}: {reset_link}")  # Para teste