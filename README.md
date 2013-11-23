# Kraken Example: Custom Middleware

An application to show the use of custom middleware for kraken.

## What we'll be doing

Starting with a [plain vanilla](https://github.com/lensam69/Kraken_Example_Custom_Middleware/commit/6efd4ff8a767936858422064b115a3e4845a3b33) application,
we're going to create a simple page counter (as middleware) and configure the application to use it.

## Running this example

Clone this repo: `git clone https://github.com/lensam69/Kraken_Example_Custom_Middleware.git`

Install the dependencies: `npm install`

Start the server: `npm start`

## Relevant code

### Application entry point
`./index.js` has four hooks where you can customize your application. These will be called exactly **once** when your application starts up.
- `app.configure` is the first one to be called. It will receive the parsed data from the configuration files in `./config/`
- `app.requestStart` is called before the default middleware is loaded (See [appcore.js](https://github.com/paypal/kraken-js/blob/master/lib/appcore.js))
- `app.requestBeforeRoute` is called after middleware is loaded, and before the routes are created.
- `app.requestAfterRoute` is the final call, and it takes place after all routes have been created.

## Changing the code

### Writing custom middleware
For this example we'll create a very rudimentary counter to find out how many requests we've served (In millions). It will be deployed as middleware, so it will be invoked
every time a resource is loaded. If you've never written middleware, read this [excellent tutorial](http://www.hacksparrow.com/how-to-write-midddleware-for-connect-express-js.html)
for an explanation on how middleware works.

Our middleware will reside in the `./lib/` directory, and will be called **millionsServed.js**

[See change here](https://github.com/lensam69/Kraken_Example_Custom_Middleware/commit/ea40b8a587f96b59d48083230f8dbbaa29a9fef9)

```javascript
module.exports = function () {
    var requestsServed = 0;

    return function (req, res, next) {
        requestsServed += 1;
        console.log(requestsServed / 1000000 + ' Million Pages Served!');
        next();
    };
};
```
This function will be invoked for every request to the server. Since we load things like scripts and images along with the page,
you may see this invoked multiple times per page load. Every time a request is received, we increment our counter by one
and print to the console

### Loading the middleware
Now that we've written the module, it's time to load it during the application startup. First, we need to require the module we just created.
Then we're going to modify the `requestBeforeRoute` function to load our middleware after the default modules have been loaded, and
before the routes have been mounted.

[See change here](https://github.com/lensam69/Kraken_Example_Custom_Middleware/commit/c7346cea7b79b92f463262c05af4c76eacc1f111)

```javascript
app.requestStart = function requestStart(server) {
    server.use(millionsServed());
};
```

Since kraken is built on top of express, `server` is nothing more than the express app, and can be configured as usual.


## Running the example
Start your server `npm start` and visit a page [http://localhost:8000](http://localhost:8000)

You should see the counter output in the console:
`0.000001 Million Pages Served!`
