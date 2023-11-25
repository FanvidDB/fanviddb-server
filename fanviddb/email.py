from typing import List

from pystmark import Message  # type: ignore
from pystmark import send  # type: ignore

from fanviddb import conf


class EmailSendFailed(Exception):
    pass


def send_email(
    from_email: str, to_emails: List[str], subject: str, content: str, tag: str = None
):
    if conf.POSTMARK_API_KEY:
        message = Message(
            sender=from_email,
            to=to_emails,
            subject=subject,
            text=content,
            tag=tag,
            message_stream="outbound",
        )
        response = send(message, api_key=conf.POSTMARK_API_KEY)
        try:
            response.raise_for_status()
        except Exception as exc:
            raise EmailSendFailed("Sending email failed") from exc
    else:
        print("-" * 79)
        print(f"From: {from_email}")
        print(f"To: {','.join(to_emails)}")
        print(f"Subject: {subject}")
        print(f"Tag: {tag}")
        print("-" * 79)
        print(content)
        print("-" * 79)
