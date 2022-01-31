const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const seedUsers = require('./seeds/user-seeds');
const seedPosts = require('./seeds/post-seeds');
const seedComments = require('./seeds/comment-seeds');
const seedVotes = require('./seeds/vote-seeds');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers/'));

sequelize.sync({ force: false}).then(async() => {
  await seedUsers();
  await seedPosts();
  await seedVotes();
  await seedComments();
  app.listen(PORT, () => console.log('Now listening'));
});
