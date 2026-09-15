# VisionGuide User Flow

## First launch

Landing carousel uses a white background, black/blue typography and blue action elements. Controls and touch targets should remain large and uncluttered.

Slides 1-4 explain:
1. Point, scan and listen
2. Purpose-based scanning
3. Listening language selection
4. AI-assisted understanding, translation and summarization

Slide 5 is the account CTA with:
- Continue with Google
- Continue with phone OTP

A small Sign in action may remain at the top-right of the landing flow for returning users.

## Authentication

Google and phone OTP use Firebase Authentication. Login and registration are the same account entry surface: an existing identity signs in; a new identity creates a user profile after Firebase authentication succeeds.

After first authentication, collect only required preferences:
- default listening language
- default scan purpose

Then enter Home.

## Home

Header:
- VisionGuide identity
- account/free-or-paid status
- settings/profile entry

Primary controls:
- Hear in: <language> selector
- large default-purpose scan card

Other purpose cards remain visible below:
- Scan Anything
- Electricity Bill
- Newspaper
- School Book
- Notebook / Copy
- Letter

The user can always choose another mode without changing their saved default.

## Free usage policy

For the first 7 account days: up to 2 successful scan consumptions per day.
After the introductory period: up to 1 successful scan consumption per day.
Paid entitlement: quota is controlled by the active paid entitlement/plan.

A failed capture or server/OCR failure must not consume quota. Quota enforcement must ultimately be server-authoritative and atomic; the mobile helper is for UI preview only.

## Plans

Initial UI/domain placeholders:
- Plan A: Free
- Plan B: Paid Monthly
- Plan C: Paid Annual (12 months)

Final pricing, limits, provider and checkout are intentionally out of scope for the initial application build. Plan definitions should later be remotely configurable, while payment and entitlement decisions remain trusted server operations.

## Returning user

Authenticated user -> Home
Unauthenticated returning user -> landing/login
First authenticated session without preferences -> preference setup -> Home
