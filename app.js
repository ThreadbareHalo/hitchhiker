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
const google = require('googleapis')
const mysql = require('mysql');

const app = express();

/*
foobar: () => {
  google.auth.getApplicationDefault(function(err, authClient) {
    if (err) {
      return cb(err);
    }

    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
          //authClient = authClient.createScoped(['https://www.googleapis.com/auth/devstorage.read_write']);
          console.log("YubNub");
    }

    var storage = google.storage('v1');
    storage.buckets.list({
        auth: authClient,
        project: projectId
      },  );
  });
}
*/


// [START hello_world]
// Say hello!
app.get('/', (req, res) => {
  //res.status(200).send('Kazowie!!');
  const _user = encodeURIComponent(process.env.MYSQL_USER);
  const _password = encodeURIComponent(process.env.MYSQL_PASSWORD);
  const _database = encodeURIComponent(process.env.MYSQL_DATABASE);
  const _host = encodeURIComponent(process.env.INSTANCE_CONNECTION_NAME)

  const uri = `mysql://${user}:${password}@${host}/${database}`;
  var connection = mysql.createConnection({
    host     : _host,
    user     : _user,
    password : _password,
    database : _database
  });
  
  connection.connect();

  connection.query('SELECT * from politicians', function (error, results, fields) {
    if (error) res.status(200).send(error);
    //console.log('The solution is: ', results[0].solution);
    res.status(200).send(results[0].firstName + ", " + results[0].lastName + " - " + results[0].party)
  });

  connection.end();
});
// [END hello_world]

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
