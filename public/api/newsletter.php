<?php
/**
 * Newsletter sign-up endpoint. Mirrors src/lib/newsletter.ts and returns the
 * NewsletterResponse shape the form expects, then emails the sign-up.
 */

require __DIR__ . '/_mail.php';

$body = read_json_body();

// Honeypot: bots get a generic 200 and nothing is sent.
if (text_field($body, 'website') !== '') {
    respond(['ok' => true], 200);
}

$email = text_field($body, 'email');
if ($email === '') {
    respond(['ok' => false, 'error' => 'validation', 'message' => 'Please enter your email address.'], 422);
}
if (!valid_email($email)) {
    respond(['ok' => false, 'error' => 'validation', 'message' => 'Please enter a valid email address, like name@company.com.'], 422);
}

$message = implode("\n", [
    'New newsletter sign-up from the Adtech website',
    '',
    'Email: ' . $email,
    'Submitted: ' . gmdate('c'),
]);

if (!send_mail('Newsletter sign-up: ' . $email, $message, $email)) {
    error_log('[newsletter] mail() failed');
    respond(['ok' => false, 'error' => 'delivery_failed', 'message' => "We couldn't complete your sign-up."], 502);
}

respond(['ok' => true], 200);
