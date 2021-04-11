from typing import List

from python_http_client.exceptions import UnauthorizedError  # type: ignore
from sendgrid import SendGridAPIClient  # type: ignore
from sendgrid.helpers.mail import Mail  # type: ignore

from fanviddb import conf


class EmailSendFailed(Exception):
    pass


def send_email(from_email: str, to_emails: List[str], subject: str, content: str):
    if conf.TESTING:
        send_dummy_email(from_email, to_emails, subject, content)
    elif conf.SENDGRID_API_KEY:
        send_sendgrid_email(from_email, to_emails, subject, content)
    else:
        send_dummy_email(from_email, to_emails, subject, content)


def send_dummy_email(from_email: str, to_emails: List[str], subject: str, content: str):
    print("-" * 79)
    print(f"From: {from_email}")
    print(f"To: {','.join(to_emails)}")
    print(f"Subject: {subject}")
    print("-" * 79)
    print(content)
    print("-" * 79)


def send_sendgrid_email(
    from_email: str, to_emails: List[str], subject: str, content: str
):
    message = Mail(
        from_email=from_email,
        to_emails=to_emails,
        subject=subject,
        plain_text_content=content,
    )
    try:
        sendgrid_client = SendGridAPIClient(conf.SENDGRID_API_KEY)
        sendgrid_client.send(message)
    except UnauthorizedError as exc:
        raise EmailSendFailed("Sending email failed") from exc
