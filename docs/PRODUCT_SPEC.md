# VisionGuide Product Specification

## Core promise
Point the phone at printed content, capture it, understand the text, and hear it in the language the user prefers.

## Home experience
After authentication, the home screen is card-based and intentionally simple.

A user may select a default purpose during onboarding. That default card is promoted at the top of Home, while all other scan modes remain visible below and can be used at any time.

Initial modes:
- Scan Anything
- Electricity Bill
- Newspaper
- School Book
- Notebook / Copy
- Letter

The mode is context, not a separate application workflow. All modes reuse the same capture, OCR, language and reader pipeline. A mode may provide a specialized AI prompt, extraction schema or reading behavior.

## Language experience
The user chooses a default listening language during onboarding and can change it later in Settings.

Home and the scan/result screen expose a compact language selector so the language can also be changed for one scan without changing the saved default.

Language resolution order:
1. Per-scan language override
2. User default listening language
3. Device/app fallback language

The source document language and listening language are separate. If they differ, VisionGuide may translate before speech.

## Scan pipeline
Capture or import image
-> OCR
-> identify selected scan mode
-> normalize extracted text
-> optionally invoke AI for structured understanding/translation
-> present readable text
-> speak in selected listening language

Basic OCR/read should remain usable without AI where practical.

## AI provider abstraction
The mobile application must never contain provider API keys or directly trust a remotely supplied secret.

Firebase stores only safe runtime configuration such as:
- active provider identifier
- model identifier
- feature flags
- backend route/config version
- timeout and capability metadata

Provider credentials remain server-side using Firebase/Google Cloud secret management. Cloud Functions act as the trusted AI gateway.

Changing the active AI provider must not require a mobile app release when the provider adapter already exists on the backend. New incompatible provider protocols require a new backend adapter.

Suggested server contract:
AIRequest { task, text, sourceLanguage?, targetLanguage?, scanMode, options? }
AIResponse { text, structuredData?, detectedLanguage?, providerMetadata? }

## Initial scan mode behavior
### Scan Anything
General OCR and natural reading. AI is optional.

### Electricity Bill
Prioritize consumer/account-safe display, billing period, amount, due date and important notices. Never infer missing financial values.

### Newspaper
Preserve headline/article order and remove obvious repeated navigation/advertising noise where reliable.

### School Book
Preserve headings and paragraphs. Allow simple explanation and translation as optional actions.

### Notebook / Copy
Optimize for photographed notes and handwriting where supported by the OCR provider. Clearly indicate uncertain recognition.

### Letter
Preserve sender/date/body structure where detectable and provide natural sequential reading.

## Maintainability
Scan modes are registry-driven. Adding a new purpose should normally mean adding mode metadata and an optional processor, not another camera/OCR implementation.

AI, OCR, speech, authentication, persistence and subscription remain separate service boundaries.

## Subscription readiness
Core domain code checks capabilities/entitlements, never payment-provider state. Payment callbacks and entitlement mutation will be server-authoritative when subscriptions are introduced.
