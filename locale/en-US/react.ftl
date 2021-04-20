-fanviddb = FanvidDB
-plex = Plex

top-navbar-website-name = { -fanviddb }

bottom-nav-general = { -fanviddb }
bottom-nav-general-using-with-plex = Using with { -plex }
bottom-nav-general-about = About
bottom-nav-general-report-issue = Report a website issue
bottom-nav-contributing = Contributing
bottom-nav-contributing-fanvid-data = Fanvid data
bottom-nav-contributing-translation = Translation
bottom-nav-contributing-documentation = Documentation
bottom-nav-coding = Coding
bottom-nav-coding-frontend = Frontend
bottom-nav-coding-backend = Backend
bottom-nav-coding-metadata-agent = { -plex } Metadata Agent
bottom-nav-coding-docs-site = Docs site
bottom-nav-coding-api = API

homepage-title = { -fanviddb }
homepage-intro =
    Welcome! FanvidDB is a central repository for fanvid-related
    metadata, in particular for integration with
    <plexLink>Plex</plexLink>. Check out the links in the
    navbar for more information.

login-form-email-label = Email
login-form-email-error-required = Please enter your email.
# Expected to have a link to <sendVerificationEmailLink>request a new token</sendVerificationEmailLink>
login-form-email-error-not-verified = Email not verified; please click the link in your
    verification email or <sendVerificationEmailLink>request a new one</sendVerificationEmailLink>.
login-form-password-label = Password
login-form-password-error-required = Please enter your password.
login-form-login-button = Log in
login-form-forgot-password-link = Forgot my password
login-form-register-link = Register
login-form-error-invalid-credentials = Invalid email or password.
login-form-error-unknown = Unknown error; please try again in a few minutes.
logout-button = Log out

register-page-title = Register
register-form-username-label = Username
register-form-username-error-required = Please enter a username.
register-form-username-error-already-exists = User already exists with that username.
register-form-username-error-unknown = Unknown error; please try again in a few minutes.
register-form-email-label = Email
register-form-email-error-required = Please enter an email.
register-form-email-error-already-exists = User already exists with that email.
register-form-password-label = Password
register-form-password-error-required = Please enter a password.
register-form-password-error-stronger-password = Please choose a stronger password.
register-form-register-button = Register

send-verification-email-page-title = Verify email
send-verification-email-form-success = We have sent an email to { $email } with a verification link.
    Please click the link to verify your email and then log in.
send-verification-email-form-send-button = Send verification email
send-verification-email-form-email-label = Email
send-verification-email-form-email-error-required = Please enter your email
send-verification-email-form-email-error-unknown = Unknown error; please try again in a few minutes.

verify-email-page-title = Verify email
# Expected to have a <loginLink>login link</loginLink>.
verify-email-success = Your email address is verified. You can now <loginLink>log in</loginLink>.
verify-email-error-unknown = Unknown error; please try again in a few minutes.
# Expected to have a link to <sendVerificationEmailLink>request a new email</sendVerificationEmailLink>
verify-email-error-token-expired = Verification link expired; please <sendVerificationEmailLink>request a new one</sendVerificationEmailLink>.
# Expected to have a link to <sendVerificationEmailLink>request a new email</sendVerificationEmailLink>
verify-email-error-bad-token = Invalid link; please <sendVerificationEmailLink>request a new one</sendVerificationEmailLink>.
# Expected to have a <loginLink>login link</loginLink>.
verify-email-error-already-verified = You are already verified. You can now <loginLink>log in</loginLink>.