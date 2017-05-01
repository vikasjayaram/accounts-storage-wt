"use strict";

const bodyParser = require('body-parser');
const express = require('express');
const Webtask = require('webtask-tools');
const tools = require('auth0-extension-tools');
const randomize  = require('randomatic');
const app     = express();

const COLLECTION = 'accounts';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    // load database... middleware
  const storageProvider = req.webtaskContext ? new tools.WebtaskStorageContext(req.webtaskContext.storage) :
                                               new tools.FileStorageContext('./accounts.json');
  const db = new tools.BlobRecordProvider(storageProvider, {
    concurrentWrites: false // Set this to true to support parallel writes. You might loose some data in this case.
  });
  req.db = db;
  next();
});
// get one record of the requested account
app.get('/:account', function (req, res) {

  getRecord(req.db, req.params.account, function (error, user) {
    if (error) return res.status(400).json({error: error});
    return res.status(200).json(user);
  });
});
// delete one record of the requested account
app.delete('/:account', function (req, res) {
  deleteRecord(req.db, req.params.account, function (error, hasBeenDeleted) {
    if (error) return res.status(400).json({error: error});
    return res.sendStatus(204);
  });
});
// Get all records
app.get('/', function (req, res) {
  getRecords(req.db, function (error, users) {
    if (error) return res.status(400).json({error: error});
    return res.status(200).json(users);
  });
});
// create a record for the user.
app.post('/', function (req, res) {
  setRecord(req.db, req.body.Digits, function (error, user) {
    if (error) return res.status(400).json({error: error});
    else {
      return res.sendStatus(200);//res.status(200).json(user);
    }  
  });    
});

function setRecord (db, data, cb) {
  const upsert = true;
  let session_id = randomize('*', 10);
  let account = data.toString();
  let timestamp = Date.now();
  db.update(COLLECTION, account, { account: account, session_id: session_id, timestamp: timestamp }, upsert)
  .then(function (doc) {
      //console.log('Document:', doc);
    return cb(null, doc);
  })
  .catch(function (err) {
    return cb(err);
  });
};

function getRecords (db, cb) {

  db.getAll(COLLECTION)
  .then(function (documents) {
      //console.log('All documents:', documents);
      return cb(null, documents);
  })
  .catch(function (err) {
    return cb(err);
  });
};

function getRecord (db, id, cb) {

  db.get(COLLECTION, id.toString())
  .then(function (doc) {
    console.log('Document:', doc);
    return cb(null, doc);
  })
  .catch(function (err) {
    return cb(err);
  });
};

function deleteRecord (db, id, cb) {
  db.delete(COLLECTION, id.toString())
  .then(function (hasBeenDeleted) {
    console.log('Document:', hasBeenDeleted);
    return cb(null, hasBeenDeleted);
  })
  .catch(function (err) {
    return cb(err);
  });
};

module.exports = Webtask.fromExpress(app);