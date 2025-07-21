from flask import current_app
from flask_mail import Message
from app import mail

def send_confirmation_email(recipient_email: str, token: str):
    subject = "Confirme seu cadastro"
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
                    color: white !important; /* Importante para o link */
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Obrigado por se cadastrar!</h2>
                <p>Por favor, clique no botão abaixo para confirmar seu endereço de e-mail e ativar sua conta:</p>
                <p>
                    <a href="{confirmation_link}" class="button">Confirmar Meu E-mail</a>
                </p>
                <p>Se você não se cadastrou em nosso site, por favor ignore este e-mail.</p>
            </div>
        </body>
    </html>
    """
    msg = Message(subject, sender=sender, recipients=[recipient_email])
    msg.html = html_body
    
    mail.send(msg)