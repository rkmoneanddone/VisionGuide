# VisionGuide Architecture

## Goals

VisionGuide must remain modular, secure, scalable, and easy to maintain as features and subscriptions are added.

## Client

React Native + TypeScript.

Module boundaries:

- `auth`: sign-in/session/profile
- `capture`: camera/gallery input
- `ocr`: text-recognition abstraction
- `reader`: text-to-speech abstraction and playback state
- `documents`: local/cloud document metadata and history
- `settings`: language, speech rate, accessibility preferences
- future `translate`, `assistant`, `subscription`

Feature modules depend on contracts, not concrete vendors. This allows OCR, speech, AI, and payments to change without rewriting screens.

## Backend

Firebase services:

- Firebase Authentication
- Cloud Firestore
- Cloud Storage
- Cloud Functions
- Firebase App Check
- Crashlytics / Analytics when mobile bootstrap is complete

Cloud Functions own privileged operations, entitlement validation, payment webhooks, and any server-side AI calls requiring protected keys.

## Security model

- Never trust subscription state sent by the client.
- Never store payment-provider secrets in the app.
- Firebase Auth UID is the primary user identifier.
- Firestore defaults to deny unless a rule explicitly permits access.
- Users may access only their own private document metadata.
- Cloud Storage paths are user-scoped.
- App Check is required before public production rollout.
- Uploaded source images should be optional and removable; basic OCR should avoid cloud upload where possible.

## Scale

Basic OCR and speech should run on-device where practical. This reduces latency, cost, and backend load.

Firestore stores small metadata records rather than large extracted images. Images, when explicitly saved, belong in Cloud Storage.

Heavy AI operations are routed through callable/HTTP functions with authentication, App Check, quota enforcement, request validation, and rate limiting.

## Subscription isolation

Core reading is unaware of payment providers. Feature gates use an interface such as:

```ts
interface EntitlementService {
  has(feature: string): Promise<boolean>;
}
```

Later, payment webhooks update server-authoritative entitlement documents. The app reads normalized entitlement state instead of payment transaction details.

## Initial data model

```text
users/{uid}
  displayName
  preferredLanguage
  speechRate
  createdAt
  updatedAt

users/{uid}/documents/{documentId}
  title
  extractedText
  sourceType
  language
  createdAt
  updatedAt

users/{uid}/entitlements/current
  plan
  status
  validUntil
  updatedAt
```

Payment transaction/audit data will be placed in server-write-only collections when subscriptions are introduced.
