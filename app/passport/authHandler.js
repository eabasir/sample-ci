const SysContextHandler = require('../../context/Sys/handler');
const errors = require('../../utils/errors.list');

let localStrategy = (req, username, password, done) => {
  SysContextHandler({
    is_command: false,
    payload: {
      username: username,
      password: password,
    },
    name: 'loginUSer',
  })
    .then(foundPerson => {
      done(null, foundPerson);
    })
    .catch(err => {
      console.error('Error in passport localStrategy: ', err);
      done(err);
    });
}

let serialize = (person, done) => {
  done(null, person.id);
};

let deserialize = (req, person, done) => {
  SysContextHandler({
    is_command: false,
    payload: person,
    name: 'userCheck',
  })
    .then(foundPerson => {
      if (person && !foundPerson) {
        req.logout()
          .then(() => done(errors.noUser));
      } else if (!foundPerson) {
        done(errors.noUser);
      } else {
        done(null, foundPerson);
      }
    })
    .catch(err => {
      console.error('Error in desrialized function: ', err.message);
      done(err);
    });
};

let afterLogin = (req, res, next) => {
  const user = req.user;
  if (!user)
    res.status(errors.noUser.status).send(errors.noUser.message);

    SysContextHandler({
    is_command: false,
    payload: {
      id: user.id,
    },
    name: 'loadUserById',
  })
    .then(foundUser => {
      if (!foundUser)
        res.status(errors.noUser.status).send(errors.noUser.message);
      else {
        delete foundUser.password;

        // Put accessed_routes and accessed_events on res (user) object
        res.status(200).json(foundUser);
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

module.exports = {
  localStrategy,
  serialize,
  deserialize,
  afterLogin,
};