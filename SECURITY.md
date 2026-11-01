# Security Policy

## Reporting Security Vulnerabilities

Shiftslabs takes the security and integrity of our Business OS ecosystem seriously. If you discover a security vulnerability in this repository or any related Shiftslabs service, please report it immediately to the security team and product owner.

- **Primary Contact**: Godknows Tochi Okereke
- **Email**: `security@shiftslabs.com`

Please include:
- A description of the vulnerability and potential impact.
- Clear steps to reproduce the issue (proof of concept script or requests).
- Affected apps or packages.

We ask that you do not disclose the vulnerability publicly until we have investigated, addressed, and verified the fix.

## Security Architecture Principles

1. **Strict Tenant Isolation**: All business data queries and mutations require verified business membership and capability permissions. IDs provided by the client are never implicitly trusted.
2. **Zero Plaintext Secrets**: Passwords are saved with modern cryptographic hashing (Argon2id/scrypt). Session identifiers are high-entropy, HTTP-only, secure, SameSite cookies.
3. **No Infrastructure Leakage**: Customer-facing responses and interfaces never leak database engine names, cloud providers, stack traces, internal IP addresses, or secrets.
4. **Idempotency & Precision**: Financial transactions (minor units), inventory movements, and webhooks enforce idempotency keys to avoid duplicate execution.
5. **Signed Storage URLs & Media Validation**: All file uploads require server-side quota verification, MIME-type and size validation, and short-lived signed URLs.
