# SIG: web-security

This is the start of the Angular track of the web-security SIG.

## Getting started

Run the following commands to start the frontend:

-   `npm install`
-   `npm start`

See README.md for more details.

Note: the client application is not used untill Step 3.

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

Simlarly you could change the authorities of the token. Note that getting all users requires the role `ROLE_ADMIN`.

The account resource returns all relevant information of the currently authenticated user. Try retrieving the account information for the system user `system`. Note that its password is not `system`!

### Step 3: obtaining and storing the JWT

Start the client application if you haven't done so already. Try logging in with user `admin`. If the login fails, it will show the message "Aanmelden mislukt!", otherwise it will just close the login modal.
Check the Network for requests. It may not record until you opened this screen - if not try logging in again (correctly). Do you see a `200 Ok` response on the authenticate resource? You can check the rest of the response under Headers and Preview. Do you see the JWT?

File `/core/auth/auth-jwt.service.ts` holds the AuthServerProvider class, which does the authenticate request to the backend on line 23. If the request is successful, the authenticateSuccess function is called. Currently this function is empty; nothing is done with the returned JWT. Implement this function to extract the JWT from the return message.
We want to store the JWT to use this in later requests. Send the JWT to the storeAuthenticationToken function. Implement this function to store the token in either sessionStorage or localStorage (or both). Note that the session and local Storage services are already imported.

#### Bonus: logging out

The AuthServerProvider also has a logout function. Can you implement this function?

### Step 4: using the JWT in requests

In the previous step you stored the JWT after obtaining it from the authenticate resource. Currently this JWT is not used in requests as can be observed by all the `401 Unauthorized` messages in the Console. Of course you could add the JWT to every request manually, but Angular has a better solution; Interceptors.

Interceptors are classes that implement HttpInterceptor and are called (chained) in every request. They have the intercept function that takes a HttpRequest object and a HttpHandler object. The interceptor can do something with the HttpRequest object and then it should call handle(request) on the HttpHandler object to pass the request to the next interceptor.

File `/blocks/interceptor/auth.interceptor.ts` holds the interceptor that should add the JWT to the header. Can you add the JWT to the header? Note that the session and local Storage services are already imported.

#### Bonus: handling expiration

File `/blocks/interceptor/auth-expired.interceptor.ts` holds the interceptor that handles expired authentication. What would you do if the authentication is expired?

### Step 5: dynamic rendering

Log in as user `user` if you haven't already done so. The menu bar shows an Administrator option, which contains a User management option among others. Click this option to go to the user-management screen, which is empty. Check the console for messages. Do you see the 403 Forbidden message? This is caused by a request to get all users, a resource this user is not authorized to! This is not user friendly; it would be better if this option would be unavailable.

File `/layouts/navbar/navbar.component.html` holds the html for the navigation bar. At line 33 you can see the Administrator option, which has a structural directive jhiHasAnyAuthority. This directive accepts an authority (or list of authorities) and dynamically renders the html if the current user has any of those authorities.
See `/shared/auth/has-any-authority.directive.ts` for the directive. Note that `structural directives` are a special class of directives (prefixed with a \*); they accept a templateRef and a viewContainerRef and can control the rendered html inside the viewContainer. This directive uses `this.viewContainerRef.clear()` to remove the html structure the directive is on. It then adds the html structure with `this.viewContainerRef.createEmbeddedView(this.templateRef)`. Well known directives that do the same are `ngIf` and `ngFor`.
The directive has an updateView function which determines if the html structure is rendered or not. Currently it always renders the html structure. Implement this functionality.
In addition the menu bar will be rendered before the user is logged in. Can you refresh the directive after logging in? Hint: use the authenticationState Subject in the AccountService.

### Step 6: protecting routes

Log in as user `user` if you haven't already done so. Try navigating to `http://localhost:9000/#/admin/user-management`. You see the same empty user-management screen you saw in Step 5. Even though the Administration option is unavailable, it is still possible to get to the page! This is still not user friendly; it would be better if this URL would be unavailable.

Angular defines its availabel URLs in Route objects. These Route objects have various properties, including a canActivate property. This property must refer to a class that implements the CanActivate interface; it must hava a canActivate function that returns a boolean - specifying whether the Route can be activated or not.

File `/admin/admin.route.ts` holds the Route that contains all Routes under the `/admin` URL. It already has an import of UserRouteAccessService, which implements CanActivate.
Add the canActivate property to the Route referencing the UserRouteAccessService.
Add a data property to the Route containing information on the required authorities. This property will be used by the UserRouteAccessService.
Open the UserRouteAccessService. Notice that the canActivate function always returns true.
Implement the function. Hint: the function contains several steps you could follow.
