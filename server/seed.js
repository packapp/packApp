const admin = require('firebase-admin');
const serviceAccount = require('../service-key.json');

const data = require('./data.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pack-602d7.firebaseio.com',
});

data &&
  Object.keys(data).forEach(key => {
    const content = data[key];

    if (typeof content === 'object') {
      Object.keys(content).forEach(docTitle => {
        admin
          .firestore()
          .collection(key)
          .doc(docTitle)
          .set(content[docTitle])
          .then(res => {
            console.log('document seeded!');
          })
          .catch(error => {
            console.error('Error seeding:', error);
          });
      });
    }
  });
