const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('./config');
const sessionMiddleware = require('./app/middleware/session');
const bodyParser = require('body-parser');

const AppRouter = require('./app/routes');

Promise.all([
    require('./app/passport').setup(),
    require('./app/mongoose').setup()
]).then((values) => {
    const [passport, mongo_params] = values;
    const app = express();

    app.locals.rootUrl = config.rootUrl;

    const store = new MongoDBStore({
        uri: mongo_params.mongoUrl.toString(),
        collection: 'sessions'
    });

    store.on('error', (err) => {
        console.error('Error in session store: ', err);
    });

    app.use(session({
        secret: config.session.secret,
        cookie: {},
        store: store,
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());

    app.use(sessionMiddleware);

    app.set('view engine', 'ejs');
    app.set('views', './views');
    app.use(expressLayouts);

    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/', new AppRouter());

    app.listen(3000, () => console.info("Application started"));
});