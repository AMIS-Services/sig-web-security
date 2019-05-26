# SIG: web-security

This is the repository for the SIG: web-security held at AMIS at thursday 6th of June 2019.

The SIG covers some of the basics in security a web developer should know. This includes SSL/TLS, (Token-based) authentication / authorization and XSS / CSRF.

The SIG is split into two parts; a presentation (see `/slides`) and hands-on. For the hands-on part you may choose between two tracks - the Angular track and the React track (you may do both, if you want). Both tracks use the same backend, which you can run yourself (requires java 8+), or you can use the one hosted at AMIS. The tracks consist of similar exercises, but use a different technology. See `/angular/EXERCISE.md` if you want to do the Angular track or `/react/EXERCISE.md` if you want to do the React track. Both tracks require Node.

## JHipster
[JHipster] was used to generate the sources for the Spring backend and both the Angular and React frontends by using the following commands:
- `jhipster --skip-client`
- `jhipster --skip-server --auth jwt --db h2`
- `jhipster --skip-server --auth jwt --db h2`
You could also use --skip-git.

## Backend
JHipster generated the client applications with a webpack configuration that starts a (node) proxy server for routing the requests. This means that all requests from the client are send to the localhost and are rerouted by the proxy server to the backend. For both tracks the proxy server is configured to route the requests to `10.252.252.206:8080` the Spring server running in the AMIS network.
If you want to run the backend yourself, change the proxy target in `/(angular|react)/webpack/webpack.dev.js` (line 32 in /angular and line 55 in /react) to `127.0.0.1:8080` and see `/backend.README.md` for further instructions.

[JHipster]: https://www.jhipster.tech/