def send_email(from_email, to_emails, subject, content):
    send_dummy_email(from_email, to_emails, subject, content)


def send_dummy_email(from_email, to_emails, subject, content):
    print("-" * 79)
    print(f"From: {from_email}")
    print(f"To: {','.join(to_emails)}")
    print(f"Subject: {subject}")
    print("-" * 79)
    print(content)
    print("-" * 79)
