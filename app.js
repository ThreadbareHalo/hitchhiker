// Copyright 2015-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const express = require('express');
const crypto = require('crypto');
const Datastore = require('@google-cloud/datastore');
const app = express();
app.enable('trust proxy');
const datastore = Datastore();

class Politician {
  constructor(firstName, lastName, party) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.party = party;
  }

  stringify() {
    return JSON.stringify(this);
  }
}

class Policy {
  constructor(id, policy) {
    this.politicianId = id;
    this.policy = policy
  }
}

// [START insertVisit]
/**
 * Insert a visit record into the database.
 *
 * @param {object} visit The visit record to insert.
 */
function insertVisit (visit) {
  return datastore.save({
    key: datastore.key('visit'),
    data: visit
  });
}

function insertPolitician(fn, ln, p) {
  var p = new Politician(fn, ln, p);
  return datastore.save({
    key: datastore.key('politician'),
    data: p
  })
}

function insertPolicy(id, policy) {
  var p = new Policy(id, policy)
  return datastore.save({
    key: datastore.key('policy'),
    data: p
  })
}

function getPolicyFor(id) {
  const query = datastore.createQuery('policy')
    .filter('politicianId', '5639445604728832')
    .limit(10);

  return datastore.runQuery(query)
    .then((results) => {
      const entities = results[0];
      return entities.map((entity) => `Policy: ${entity.policy}`);
    });
}
// [END insertVisit]

// [START getVisits]
/**
 * Retrieve the latest 10 visit records from the database.
 */
function getVisits () {
  const query = datastore.createQuery('visit')
    .order('timestamp', { descending: true })
    .limit(10);

  return datastore.runQuery(query)
    .then((results) => {
      const entities = results[0];
      return entities.map((entity) => `Time: ${entity.timestamp}, AddrHash: ${entity.userIp}`);
    });
}
// [END getVisits]

app.get('/', (req, res, next) => {
  // Create a visit record to be stored in the database
  //const visit = {
  //  timestamp: new Date(),
    // Store a hash of the visitor's ip address
  //  userIp: crypto.createHash('sha256').update(req.ip).digest('hex').substr(0, 7)
  //};

  //insertPolitician("foo", "bar", "D");
  //insertPolicy(5639445604728832, "Likes puppies")
  
  getPolicyFor('5639445604728832')
    .then((policies) => {
      res
        .status(200)
        .set('Content-Type', 'text/plain')
        .send(`5639445604728832's policies:\n${policies.join('\n')}`)
        .end();
    })
  /*
  insertVisit(visit)
    // Query the last 10 visits from Datastore.
    .then(() => getVisits())
    .then((visits) => {
      res
        .status(200)
        .set('Content-Type', 'text/plain')
        .send(`Last 10 visits:\n${visits.join('\n')}`)
        .end();
    })
    .catch(next);
    */
});

if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;
