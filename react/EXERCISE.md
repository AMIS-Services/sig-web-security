# SIG: web-security

This is the start of the Angular track of the web-security SIG.

## Getting started

Run the following commands to start the frontend:

- `npm install`
- `npm start`

See README.md for more details.

## Hands-on

### Step 1: examining the API

The API has the following endpoints of interest:
- `/api/authenticate` (POST)
- `/api/account` (GET)
- `/api/users` (GET|POST|PUT)
- `/api/users/{login}` (GET|DELETE)
- `/api/authorities` (GET)

Try getting all users from the backend using Postman. Do you get a `401 Unauthorized` response?
This response indicates that you are not authenticated and therefore not allowed to get this resource.

Try authenticating with the default user `user` identified by `user`. The authenticate resource accepts a simple JSON object with fields "username" and "password". Do you get an `id_token`?

The token you received is a so-called Json Web Token (JWT) and is send with requests to authenticate the request. In Postman you can send this token with requests by pasting it in the field under Authorization > type Bearer Token. Try getting all users again. Do you get the users `system`, `admin` and `user`?

Try getting all authorities. Do you get a `403 Forbidden` response?
This response indicates that you are authenticated, but not authorized (and therefore not allowed) to get this resource.

You may try getting the authorities again with a JWT obtained by authenticating with the default admin user `admin`. This user is authorized to get all authorities.

### Step 2: a closer look at JWTs

Do you still have your token? Navigate to `https://jwt.io/` and paste the token. It quickly decodes the token and reveals a `Header` - indicating the hashing algorithm - a `Body` - containing claims such as the subject, the authorities and the expiration date - and a `Signature`. The Header and Body are simple JSON objects that are Base64 encoded into a String. The Signature contains the Base64 encoded hash over the Header and Body. To calculate the hash, a secret key is used, which is only known by the Spring backend...or is it...? 
See `/backend/src/resources/config/application-dev.yml` for the backend configuration; the base64-secret used to calculate the hash is available at line 95. You can paste the key at `https://jwt.io/` and start forging your own token. You may have to check the "secret base64 encoded" option.

The expiration date of the token is in epoch format (see https://www.epochconverter.com/ for a converter). Try changing the expiration date to the past, to generate an expired token. Then try getting all users with this token. Do you get a `401 Unauthorized` response?

Simlarly you could change the authorities of the token. Note that getting all users requires you to be authenticated (that is, a valid token), while getting all authorities requires the role `ROLE_ADMIN`.

The account resource returns all relevant information of the currently authenticated user. Try retrieving the account information for the system user `system`. Note that its password is not `system`!