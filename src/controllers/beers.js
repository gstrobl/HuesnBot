import { db } from 'controllers/config';

const addBeerList = ({ data, docName }) => {
  const docRef = db.collection('beers').doc(docName);
  docRef.set({ data });
};

const getBeerList = async (docName) => {
  if (docName) {
    const docRef = db.collection('beers').doc(docName);
    const { data } = await docRef
      .get()
      .then((doc) => doc.data())
      .catch((err) => {
        console.log('Error getting document', err);
      });
    console.log('###', data);

    return data;
  }
  return null;
};

export { getBeerList, addBeerList };
