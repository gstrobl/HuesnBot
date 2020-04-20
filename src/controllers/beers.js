import { db } from 'controllers/config';

const addBeerList = ({ data, docName }) => {
  console.log('data', data);

  const docRef = db.collection('beers').doc(docName);
  docRef.set({ data });
};

const getRecord = () => {
  //   const ref = db.ref('server/saving-data/fireblog/posts');

  return 'test';
};

export { getRecord, addBeerList };
