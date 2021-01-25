import { db } from 'controllers/config';
import { isEmpty } from 'utils/formatter';

const addPages = ({ pages }) => {
  const docRef = db.collection('pages');
  pages.map(async (page) => {
    await docRef
      .where('url', '==', page)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          // eslint-disable-next-line no-console
          if (!isEmpty(page)) {
            docRef.add({ url: page, craweledDate: new Date() });
          }
        }
      });
    return null;
  });

  return { status: 200 };
};

const getPages = async () => {
  const docRef = db.collection('pages');
  // .orderBy('priceValidUntil')
  // .where('priceValidUntil', '>=', new Date());

  const data = await docRef
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        // eslint-disable-next-line no-console
        console.log('No matching documents.');
        return null;
      }

      const output = [];
      snapshot.forEach((doc) => {
        if (!output.some((item) => item.url === doc.data().url)) {
          output.push(doc.data());
        }
      });

      return output;
    })
    .catch((err) => {
      console.log('Error getting document', err);
    });

  return data;
};

export { addPages, getPages };
