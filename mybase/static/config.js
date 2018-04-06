/*global System */
'use strict';

System.config({
  transpiler: "babel",
  packages: {
    './': { defaultExtension: false }
  },
  map: {
    "react": "npm:react@16.2.0",
    "react-dom": "npm:react-dom@16.2.0",
    "react-router": "npm:react-router@4.2.0"
  }
});
