# VisionGuide

VisionGuide is a modular mobile accessibility app that helps users scan or photograph printed text, extract it, and read it aloud. The product is designed to evolve into a broader visual reading assistant with translation, explanation, summarization, document history, and subscription features.

## Product principles

- Mobile-first and accessibility-first
- Modular features with clear boundaries
- Firebase-backed services
- Offline-first for basic scan/read where practical
- Subscription-ready, but payments are deliberately isolated from core reading features
- Secure by default: least-privilege Firestore rules, no secrets in the client, server-authoritative entitlements
- Designed for maintainability and horizontal scale

## Planned modules

1. Authentication
2. Camera / image import
3. OCR
4. Reader / text-to-speech
5. Documents and history
6. Translation
7. AI explanation / summarization
8. Preferences and accessibility
9. Subscription and entitlement management
10. Telemetry / operational diagnostics

## Initial architecture

```text
mobile/
  src/
    app/
    core/
    modules/
      auth/
      capture/
      ocr/
      reader/
      documents/
      settings/
    services/
backend/
  functions/
  firestore/
docs/
```

The mobile client will use React Native + TypeScript. Firebase will provide authentication, Firestore, Cloud Storage, Cloud Functions, App Check, Crashlytics/Analytics as required.

## V1 user flow

```text
Open app
  -> Capture photo / choose image
  -> Extract text
  -> Review extracted text
  -> Read aloud
  -> Pause / resume / stop
  -> Adjust reading speed
```

Advanced interpretation remains separate from OCR so that basic reading can remain fast and low-cost.

## Development policy

Changes should land through focused feature branches/PRs. Core domain modules must not directly depend on payment providers. Entitlements are exposed through a provider-neutral interface so subscriptions can be added later without rewriting reading features.
