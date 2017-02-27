var koa = require('koa');
var parse = require('co-body');
var session = require('koa-session');
var views = require('co-views');
var fs = require('fs');

var app = new koa();

var form = '<form action="/login" method="POST">\
  <input name="username" type="text" value="username">\
  <input name="password" type="password" placeholder="The password is \'password\'">\
  <button type="submit">Submit</button>\
</form>';


// use koa-session somewhere at the top of the app
// we need to set the `.keys` for signed cookies and the cookie-session module
app.keys = ['secret1', 'secret2', 'secret3'];
app.use(session(app));

/**
 * If `this.session.authenticated` exist, user will see 'hello world'
 * otherwise, people will get a `401` error  because they aren't logged in
 */

app.use(function* home(next) {
  if (this.request.path !== '/') return yield next;

  if(this.session.authenticated) return this.body = 'hello world';
  this.status = 401;
});

/**
 * If successful, the logged in user should be redirected to `/`.
 * hint: use `this.redirect`
 */

app.use(function* login(next) {
  if (this.request.path !== '/login') return yield next;
  if (this.request.method === 'GET') return this.body = form;
  if (this.request.method !== 'POST') return;

  var body = yield parse(this);
  if(body.username !== 'username' || body.password !== 'password') return this.status = 400;

  this.session.authenticated = true;
  this.redirect('/');
});

/**
 * Let's redirect to `/login` after every response.
 * If a user hits `/logout` when they're already logged out,
 * let's not consider that an error and rather a "success".
 */

app.use(function* logout(next) {
  if (this.request.path !== '/logout') return yield next;

  this.session.authenticated = false;
  this.redirect('/login');
});


// var render = views(__dirname + '/views', {
//   ext: 'ejs'
// });
//
// var user = {
//   name: {
//     first: 'Tobi',
//     last: 'Holowaychuk'
//   },
//   species: 'ferret',
//   age: 3
// };
//
// app.use(function* (next) {
//   this.body = yield render('user', {user: user});
// })


// app.use(session(app));
//
// app.use(function* () {
//   var n = ~~this.session.view + 1;
//   this.session.view = n;
//   this.body = n + ' views';
// })

// app.use(function* () {
//   // ~~ is double bitwise NOT operator
//   var n = ~~this.cookies.get('view', {signed: true}) + 1;
//   this.cookies.set('view', n, {signed: true});
//   this.body = n + ' views';
// })

// app.use(errorHandler());
//
// app.use(function* () {
//   if(this.path === '/error') throw new Error('ooops');
//   this.body = 'OK'
// })
//
// function errorHandler() {
//   return function* (next) {
//     try {
//       yield next;
//     } catch(err) {
//       this.status = 500;
//       this.body = 'internal server error';
//     }
//   }
// }

// app.use(responseTime());
// app.use(upperCase());
//
// app.use(function* () {
//   this.body = 'hello koa';
// });
//
// function responseTime() {
//   return function* (next) {
//     // record start time
//     var start = new Date;
//     yield next;
//     // set X-Response-Time head
//     this.set('X-Response-Time', new Date - start);
//   };
// }
//
// function upperCase() {
//   return function* (next) {
//     // do nothing
//     yield next;
//     // convert this.body to upper case
//     this.body = this.body.toUpperCase();
//   };
// }


// app.use(function* (next) {
//   this.body = this.request.is('json') ? {message: 'hi!'} : 'ok';
// })

// app.use(function* (next) {
//   if(this.path !== '/'){
//     return yield next;
//   }
//   var body = yield parse(this, {limit: '1kb'});
//   if(!body.name) { this.throw(400, '.name required') };
//   this.body = body.name.toUpperCase();
// });
//
// app.use(function* (next) {
//   if(this.path !== '/json'){
//     return yield next;
//   }
//   this.body = { foo: 'bar' };
// })
//
// app.use(function* (next) {
//   if(this.path !== '/stream'){
//     return yield next;
//   }
//   this.body = fs.createReadStream(process.argv[3]);
// })
//
// app.use(function* (next) {
//   if(this.path !== '/500'){
//     return yield next;
//   }
//   this.body = 'internal server error';
// })
//
// app.use(function* (next) {
//   if(this.path !== '/404'){
//     return yield next;
//   }
//   this.body = 'page not found';
// })

var port = process.argv[2];

app.listen(port);
