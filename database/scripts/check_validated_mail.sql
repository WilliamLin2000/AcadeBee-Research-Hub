SELECT COUNT(*) AS verified_users
FROM users
WHERE email_verified = TRUE;