<?php
/**
 * Shared helpers for the form endpoints. These scripts run on the PHP web host
 * (Hostinger) next to the static export; `npm run dev` does not run them.
 *
 * Messages are sent with PHP mail() to the inbox below. Keep it in sync with
 * siteConfig.contact.email in src/config/site.ts.
 */

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(404);
    exit;
}

const RECIPIENT = 'myadtech@gmail.com';
const MAX_BODY_BYTES = 16000;
// Same rule as EMAIL_PATTERN in src/lib/contact.ts.
const EMAIL_PATTERN = '/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u';

function respond(array $body, int $status): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Reads the JSON request body, rejecting anything that isn't a POSTed object. */
function read_json_body(): array
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        respond(['ok' => false, 'error' => 'bad_request', 'message' => 'Method not allowed.'], 405);
    }
    $raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
    if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
        respond(['ok' => false, 'error' => 'bad_request', 'message' => 'The request is too large.'], 413);
    }
    $body = json_decode($raw, true);
    if (!is_array($body)) {
        respond(['ok' => false, 'error' => 'bad_request', 'message' => 'Invalid request body.'], 400);
    }
    return $body;
}

function text_field(array $body, string $key): string
{
    return isset($body[$key]) && is_string($body[$key]) ? trim($body[$key]) : '';
}

function str_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function valid_email(string $value): bool
{
    return $value !== ''
        && str_length($value) <= 254
        && preg_match(EMAIL_PATTERN, $value) === 1
        && !preg_match('/[\r\n]/', $value);
}

/** Sends a plain-text message to RECIPIENT; replies go to $replyTo. */
function send_mail(string $subject, string $body, string $replyTo): bool
{
    $host = preg_replace('/^www\./i', '', strtolower($_SERVER['HTTP_HOST'] ?? 'localhost'));
    $host = preg_replace('/[^a-z0-9.-]/', '', $host);
    $headers = [
        'From: Adtech Website <noreply@' . $host . '>',
        'Reply-To: ' . $replyTo,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    return mail(RECIPIENT, $encodedSubject, $body, implode("\r\n", $headers));
}
