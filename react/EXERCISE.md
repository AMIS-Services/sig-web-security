# SIG: web-security

This is the start of the Angular track of the web-security SIG.

## Getting started

Run the following commands to start the frontend:

-   `npm install`
-   `npm start`

See README.md for more details.

Note: the client application is not used until Step 3.

## Hands-on

### Step 1: examining the API

The API has the following endpoints of interest:

-   `/management/info` (GET)
-   `/api/authenticate` (POST)
-   `/api/account` (GET)
-   `/api/users` (GET|POST|PUT)
-   `/api/users/{login}` (GET|DELETE)
-   `/api/users/authorities` (GET)

Try getting the management-info from the backend using Postman. Do you get a `200 OK` response? The returned json contains some properties that are used by the client application to render in a certain way.

Try getting the account from the backend using Postman. Yes, this is an illogical request; nobody knows what account to return. Do you get a `401 Unauthorized` response?
This response indicates that the resource is protected and you are not authenticated - and therefore not allowed to see it.

Try authenticating with the default user `user` identified by `user`. The authenticate resource accepts a simple JSON object with fields "username" and "password". Do you get an `id_token`?

The token you received is a so-called Json Web Token (JWT) and is send with requests to authenticate the request. In Postman you can send this token with requests by pasting it in the field under Authorization > type Bearer Token. Try getting the account again. Do you get detail information of `user`?

Try getting all users. Do you get a `403 Forbidden` response?
This response indicates that you are authenticated, but not authorized (and therefore not allowed) to get this resource.

You may try getting the authorities again with a JWT obtained by authenticating with the default admin user `admin`. This user is authorized to get all authorities.

### Step 2: a closer look at JWTs

Do you still have your token? Navigate to `https://jwt.io/` and paste the token. It quickly decodes the token and reveals a `Header` - indicating the hashing algorithm - a `Body` - containing claims such as the subject, the authorities and the expiration date - and a `Signature`. The Header and Body are simple JSON objects that are Base64 encoded into a String. The Signature contains the Base64 encoded hash over the Header and Body. To calculate the hash, a secret key is used, which is only known by the Spring backend...or is it...?
See `/backend/src/resources/config/application-dev.yml` for the backend configuration; the base64-secret used to calculate the hash is available at line 95. You can paste the key at `https://jwt.io/` and start forging your own token. You may have to check the "secret base64 encoded" option.

The expiration date of the token is in epoch format (see https://www.epochconverter.com/ for a converter). Try changing the expiration date to the past, to generate an expired token. Then try getting all users with this token. Do you get a `401 Unauthorized` response?

Similarly you could change the authorities of the token. Note that getting all users requires the role `ROLE_ADMIN`.

The account resource returns all relevant information of the currently authenticated user. Try retrieving the account information for the system user `system`. Note that its password is not `system`!

### Step 3: obtaining and storing the JWT

Start the client application if you haven't done so already. Try logging in with user `admin`. Are you logged in?
Check the Network for requests. It may not record until you opened this screen - if not try logging in again. Do you see a `200 Ok` response on the authenticate resource? You can check the rest of the response under Headers and Preview. Do you see the JWT?

This React client application is a typical react+redux setup. The application state is kept in a redux store. The components can connect to this store to render the correct view and call reducers to modify the store.

The `app/modules/login/login.tsx` is the login component which uses the login reducer to authenticate. The login reducer can be found in the file `app/shared/reducers/authentication.ts`. This reducer does the authenticate request to the backend. Notice the "await dispatch" which uses axios.post to do this request.

If the request is successful, the reducer continues. Currently this function does nothing with the returned JWT! Implement this function to extract the JWT from the return message.
Just retrieving the JWT is not enough, you need to store it to use it in later requests. Implement to store the token in sessionStorage or localStorage. Note that the Storage class for these Stores are already imported. Do you know the difference between these Stores? The sessionStorage is cleared upon closing the browser tab, while the localStorage is kept even when the browser is closed.

#### Bonus: logging out

The authentication reducers also have a logout reducer. Can you implement this function?

### Step 4: using the JWT in requests

In the previous step you stored the JWT after obtaining it from the authenticate resource. Currently this JWT is not used in requests as can be observed by all the `401 Unauthorized` messages in the Console. Of course you could add the JWT to every request manually, but React Axios has a better solution; Interceptors.

Interceptors are functions which are used when axios makes a request. These intercept functions receive the request object which will be sent or receive the response object which was returned.

These functions are called by Axios for every request (and response). The interceptor can do something with the object.

File `app/config/axios-interceptor.ts` holds the interceptor that should add the JWT to the header. Can you add the JWT to the header? Note that the session and local Storage services are already imported.

Open User management (Administrator > User management). Do you see a table with available users?

#### Bonus: handling expiration

File `app/config/axios-interceptor.ts` holds also the response interceptor that handles expired authentication. What would you do if the authentication is expired?

### Step 5: dynamic rendering

Log in as user `user`; this user has less privileges. Open User management again (Administrator > User management). Notice that the table is empty. Open the console. Do you see the 403 Forbidden message? This is caused by a request to get all users, a resource this user is not authorized to! This is not user friendly; it would be better if this option would be unavailable.

File `app/shared/layout/header/header.tsx` holds the html for the navigation bar. Find the Administrator option and notice that it only checks for "isAuthenticated". It adds the "AdminMenu" component based on this condition. The "isAuthenticated" is a property of the Header component. In a similar way you can add an "isAdmin" property.

The `app/app.tsx` adds the Header to the html and needs to pass the new property. To do this it needs itself a property with the same name. The `app/app.tsx` is also connected to the store and can use the stored account to determine if the logged in user is an admin. The stored account has a list of authorities which can be compared with a list of required authorities "[AUTHORITIES.ADMIN]". For this you can use the already imported "hasAnyAuthority" function in the "mapStateToProps" function. The authentication object contains the stored account.

Try logging in as user `user` again. Is the Administrator option removed from the menu bar?

### Step 6: protecting routes

Log in as user `user` if you haven't already done so. Try navigating to `http://localhost:9000/#/admin/user-management`. You see the same empty user-management screen you saw in Step 5. Even though the Administration option is unavailable, it is still possible to get to the page! This is still not user friendly; it would be better if this URL would be unavailable.

React defines its available URLs in Route components. These Route components have various properties, but none is for protecting a URL. To make a route protected/private you can just create your own PrivateRoute component which wraps around a normal Route component. This is the normal way how React uses components in composition to get what you want. The current client already has an implementation for this PrivateRoute component in the file `app/shared/auth/private-route.tsx`. This PrivateRoute component has a property hasAnyAuthorities which contains the list of required authorities.

File `app\routes.tsx` holds the Router Switch that contains all Routes. It already has an import of PrivateRoute
Change the "ErrorBoundaryRoute" to "PrivateRoute" and add a property to the Route containing information on the required authorities.
Open the PrivateRoute. Notice that the renderRedirect function always returns true.
Implement the function. Hint: the function contains several steps you could follow.
