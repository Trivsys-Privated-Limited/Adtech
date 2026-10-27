<?php
/**
 * Contact form endpoint. Mirrors the rules in src/lib/contact.ts and returns
 * the ContactResponse shape the form expects, then emails the enquiry.
 */

require __DIR__ . '/_mail.php';

$body = read_json_body();

// Honeypot: real visitors never see or fill the "website" field.
// Bots get a generic 200 and nothing is sent.
if (text_field($body, 'website') !== '') {
    respond(['ok' => true], 200);
}

$payload = [];
foreach (['name', 'email', 'company', 'projectType', 'details'] as $key) {
    $payload[$key] = text_field($body, $key);
}

// Generated at build time from src/content/services.ts.
$projectTypes = json_decode((string) @file_get_contents(__DIR__ . '/project-types.json'), true);

$fields = [];

$name = $payload['name'];
if ($name === '') {
    $fields['name'] = 'Please enter your name.';
} elseif (str_length($name) < 2) {
    $fields['name'] = 'Your name looks too short.';
} elseif (str_length($name) > 100) {
    $fields['name'] = 'Please keep your name under 100 characters.';
}

if ($payload['email'] === '') {
    $fields['email'] = 'Please enter your work email.';
} elseif (!valid_email($payload['email'])) {
    $fields['email'] = 'Please enter a valid email address, like name@company.com.';
}

if (str_length($payload['company']) > 120) {
    $fields['company'] = 'Please keep the company name under 120 characters.';
}

if ($payload['projectType'] === '') {
    $fields['projectType'] = 'Please choose a project type.';
} elseif (is_array($projectTypes) && !in_array($payload['projectType'], $projectTypes, true)) {
    $fields['projectType'] = 'Please choose a project type from the list.';
}

$details = $payload['details'];
if ($details === '') {
    $fields['details'] = 'Please tell us a little about your project.';
} elseif (str_length($details) < 20) {
    $fields['details'] = 'Please add a bit more detail (at least 20 characters).';
} elseif (str_length($details) > 4000) {
    $fields['details'] = 'Please keep project details under 4000 characters.';
}

if ($fields) {
    respond(['ok' => false, 'error' => 'validation', 'fields' => $fields], 422);
}

$message = implode("\n", [
    'New enquiry from the Adtech website',
    '',
    'Name: ' . $payload['name'],
    'Email: ' . $payload['email'],
    'Company: ' . ($payload['company'] !== '' ? $payload['company'] : '-'),
    'Project type: ' . $payload['projectType'],
    'Submitted: ' . gmdate('c'),
    '',
    'Project details:',
    $payload['details'],
]);

if (!send_mail('New enquiry: ' . $payload['projectType'] . ' - ' . $payload['name'], $message, $payload['email'])) {
    error_log('[contact] mail() failed');
    respond(['ok' => false, 'error' => 'delivery_failed', 'message' => "We couldn't deliver your message."], 502);
}

respond(['ok' => true], 200);
