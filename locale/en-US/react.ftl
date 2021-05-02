-fanviddb = FanvidDB
-plex = Plex

http-500-page-title = Sorry, something went wrong. Please try again in a few minutes.
http-500-page-title-bar = Something went wrong | { -fanviddb }
http-500-page-escape-button = Return Home
http-404-page-title = The page could not be found.
http-404-page-title-bar = Page not found | { -fanviddb }
http-404-page-escape-button = Return Home


content-notes-graphic-violence = Graphic Depictions Of Violence
content-notes-major-character-death = Major Character Death
content-notes-no-warnings-apply = No Warnings Apply
content-notes-rape-or-non-con = Rape/Non-Con
content-notes-underage = Underage
content-notes-physical-triggers = Physical Triggers
content-notes-animal-harm = Animal Harm
content-notes-auditory-triggers = Auditory Triggers
content-notes-blackface-or-brownface-or-redface = Blackface/Brownface/Redface
content-notes-significant-blood-or-gore = Blood/Gore
content-notes-depictions-of-police = Depictions of Police
content-notes-holocaust-or-nazi-imagery = Holocaust and/or Nazi Imagery
content-notes-incest = Incest
content-notes-queerphobia = Queerphobia
content-notes-racism = Racism
content-notes-self-harm = Self-harm
content-notes-suicide = Suicide
content-notes-transphobia = Transphobia

rating-gen = General Audiences
rating-teen = Teen
rating-mature = Mature
rating-explicit = Explicit

language-en-US = English (US)
language-es-ES = Spanish (Spain)
language-de-DE = German (Germany)
language-zh-CN = Chinese (Mainland)

unique-identifier-filename = Filename
unique-identifier-youtube = YouTube
unique-identifier-vimeo = Vimeo
unique-identifier-ao3 = AO3
unique-identifier-bilibili = bilibili
unique-identifier-other = Other

form-error-string-min-length =
    { $limit_value ->
        [one] This field cannot be empty.
       *[other] This field must contain at least { $limit_value } characters.
    }
form-error-url-host = URL host invalid, top level domain required

top-navbar-website-name = { -fanviddb }

side-nav-add-fanvid = Add Fanvid

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

login-page-title = { -fanviddb }
login-page-title-bar = Login | { -fanviddb }
login-page-intro =
    Welcome! { -fanviddb } is a central repository for fanvid-related
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
register-page-title-bar = Register | { -fanviddb }
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
send-verification-email-page-title-bar = Verify email | { -fanviddb }
send-verification-email-form-success = We have sent an email to { $email } with a verification link.
    Please click the link to verify your email and then log in.
send-verification-email-form-send-button = Send verification email
send-verification-email-form-email-label = Email
send-verification-email-form-email-error-required = Please enter your email
send-verification-email-form-email-error-unknown = Unknown error; please try again in a few minutes.

verify-email-page-title = Verify email
verify-email-page-title-bar = Verify email | { -fanviddb }
# Expected to have a <loginLink>login link</loginLink>.
verify-email-success = Your email address is verified. You can now <loginLink>log in</loginLink>.
verify-email-error-unknown = Unknown error; please try again in a few minutes.
# Expected to have a link to <sendVerificationEmailLink>request a new email</sendVerificationEmailLink>
verify-email-error-token-expired = Verification link expired; please <sendVerificationEmailLink>request a new one</sendVerificationEmailLink>.
# Expected to have a link to <sendVerificationEmailLink>request a new email</sendVerificationEmailLink>
verify-email-error-bad-token = Invalid link; please <sendVerificationEmailLink>request a new one</sendVerificationEmailLink>.
# Expected to have a <loginLink>login link</loginLink>.
verify-email-error-already-verified = You are already verified. You can now <loginLink>log in</loginLink>.

fanvid-create-page-title = Add Fanvid
fanvid-create-page-title-bar = Add Fanvid | { -fanviddb }
fanvid-edit-page-title = Edit { $title }
fanvid-edit-page-title-bar = Edit { $title } | { -fanviddb }
fanvid-edit-page-title-bar-loading = Edit fanvid | { -fanviddb }
fanvid-form-error-unknown = Unknown error occurred, please try again in a few minutes
fanvid-form-save-button = Save
fanvid-form-save-success = Saved
fanvid-form-save-no-changes = No changes
fanvid-form-title-label = Title
fanvid-form-title-error-required = Title is required
fanvid-form-creators-label = Creators
fanvid-form-creators-error-required = At least one creator is required
fanvid-form-premiere-date-label = Premiere date
fanvid-form-premiere-event-label = Premiere event
fanvid-form-audio-title-label = Audio Title
fanvid-form-audio-artists-or-sources-label = Audio Artists or Sources
fanvid-form-audio-languages-label = Audio Language
fanvid-form-audio-languages-help = Additional languages may be specified as language codes, for example en-US for English as spoken in the United States.
fanvid-form-length-label = Length
fanvid-form-length-error-required = Length is required
fanvid-form-rating-label = Rating
fanvid-form-rating-error-required = Rating is required
fanvid-form-fandoms-label = Fandoms
fanvid-form-fandoms-error-required = At least one fandom is required
fanvid-form-summary-label = Summary
fanvid-form-summary-error-required = Summary is required
fanvid-form-content-notes-label = Content notes
fanvid-form-content-notes-error-required = At least one content note must be selected. If none apply, select { content-notes-no-warnings-apply }.
fanvid-form-urls-label = Canonical URLs
fanvid-form-urls-error-invalid-url = Please enter a valid URL, including the scheme (http / https).
fanvid-form-unique-identifiers-label = Unique identifiers
fanvid-form-thumbnail-url-label = Thumbnail URL
fanvid-form-thumbnail-url-error-invalid-url = Please enter a valid URL, including the scheme (http / https).

fanvid-list-page-title-bar = Fanvids | { -fanviddb }
fanvid-list-error-unknown = Something went wrong. Please try again in a few minutes.

fanvid-view-page-title-bar = { $title } | { -fanviddb }
fanvid-view-page-title-bar-loading = Loading Fanvid... | { -fanviddb }
fanvid-view-page-edit-link = Edit
fanvid-view-page-fanvid-length-header = Length
fanvid-view-page-fanvid-audio-header = Audio
fanvid-view-page-fanvid-premiere-header = Premiere
fanvid-view-page-fanvid-urls-header = URLs
fanvid-view-page-added-label = Added
fanvid-view-page-modified-label = Modified
