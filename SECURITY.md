# Security Documentation

This document outlines the security measures implemented in the Sunshine Hotel application.

## Security Features

### Backend Security

1. **Helmet.js** - Sets secure HTTP headers
   - Content Security Policy (CSP)
   - XSS Protection
   - Frame Options
   - HSTS

2. **CORS** - Cross-Origin Resource Sharing
   - Configured to only allow specific origins
   - Credentials enabled for authenticated requests
   - Production: Supports multiple origins via comma-separated list

3. **Rate Limiting**
   - API rate limiting: 120 requests per minute
   - Login rate limiting: 5 attempts per 15 minutes
   - Prevents brute force attacks

4. **Input Validation**
   - Joi schema validation for all inputs
   - MongoDB injection protection (express-mongo-sanitize)
   - XSS protection (xss-clean)
   - HTTP Parameter Pollution protection (hpp)

5. **Authentication & Authorization**
   - JWT-based authentication
   - Secure HTTP-only cookies
   - CSRF protection
   - Account lockout after failed login attempts

6. **Password Security**
   - Bcrypt hashing with salt rounds
   - Passwords never stored in plain text
   - Minimum password requirements

7. **Error Handling**
   - No stack traces exposed in production
   - Generic error messages for internal errors
   - Detailed errors only in development

8. **File Upload Security**
   - File size limits (5MB default)
   - File type validation
   - Uploads stored in Cloudinary (not on server)
   - Local files cleaned after upload

### Frontend Security

1. **Environment Variables**
   - API URL configured via environment variables
   - No hardcoded secrets

2. **Production Build**
   - Console logs removed in production builds
   - Source maps disabled in production
   - Code minification and optimization

3. **API Communication**
   - CSRF token handling
   - Credentials included for authenticated requests
   - Error handling without exposing sensitive data

## Security Best Practices

### For Developers

1. **Never commit secrets:**
   - `.env` files are in `.gitignore`
   - Use environment variables for all secrets
   - Rotate secrets regularly

2. **Keep dependencies updated:**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Use strong secrets:**
   - JWT_SECRET: Minimum 32 characters
   - Use random generators: `openssl rand -base64 32`

4. **Review logs regularly:**
   - Monitor for suspicious activity
   - Check failed login attempts
   - Review API usage patterns

### For Deployment

1. **Environment Variables:**
   - Set all required variables
   - Use different secrets for production
   - Never use development secrets in production

2. **Database:**
   - Use strong database passwords
   - Whitelist IP addresses in MongoDB Atlas
   - Enable MongoDB authentication

3. **CORS:**
   - Only allow your frontend domain(s)
   - Don't use wildcards in production
   - Update when deploying to new domains

4. **Cloudinary:**
   - Use signed URLs for sensitive images
   - Set up upload presets with restrictions
   - Monitor usage and set limits

## Security Checklist

Before deploying to production:

- [ ] All environment variables set
- [ ] Strong JWT_SECRET (32+ characters)
- [ ] Strong MongoDB password
- [ ] CORS_ORIGIN set to production domain only
- [ ] Cloudinary credentials configured
- [ ] Admin password changed from default
- [ ] Rate limiting configured
- [ ] Error handling tested
- [ ] File upload limits set
- [ ] Dependencies updated (`npm audit`)
- [ ] No console.logs in production code
- [ ] Source maps disabled in production
- [ ] HTTPS enabled (Vercel/Render provide this)

## Monitoring

### What to Monitor

1. **Failed Login Attempts**
   - Check for brute force attempts
   - Monitor account lockouts

2. **API Usage**
   - Unusual request patterns
   - Rate limit violations

3. **Error Logs**
   - 500 errors
   - Database connection issues
   - Cloudinary upload failures

4. **File Uploads**
   - Unusual file sizes
   - Failed uploads
   - Storage usage

## Incident Response

If a security issue is discovered:

1. **Immediately:**
   - Rotate affected secrets
   - Review access logs
   - Check for unauthorized access

2. **Short-term:**
   - Update affected systems
   - Notify users if necessary
   - Document the incident

3. **Long-term:**
   - Review security measures
   - Update security documentation
   - Implement additional safeguards

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public issue
2. Contact the development team privately
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before disclosure

## Updates

This security documentation should be reviewed and updated:
- After security incidents
- When adding new features
- When dependencies are updated
- Quarterly as part of security audits

