function importAll(r) {
    r.keys().forEach(r);
  }
  
  importAll(require.context('./components', false, /\.js$/));