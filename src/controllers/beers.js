import { db } from 'controllers/config';
import { classifyProduct, isEmpty } from 'utils/formatter';

const addBeers = ({ productData, groceryStore, brand }) => {
  const docRef = db.collection('beers');

  const data = JSON.parse(productData);
  let entry = {};
  if (/.*(f|F)lasche$/.test(data.name)) {
    entry = {
      name: data.name,
      supermarket: groceryStore || null,
      type: 'bottle',
      ...classifyProduct(data, brand),
    };
  }
  if (/.*(d|D)ose$/.test(data.name)) {
    entry = {
      name: data.name,
      supermarket: groceryStore || null,
      type: 'can',
      ...classifyProduct(data, brand),
    };
  }

  if (!isEmpty(entry)) {
    docRef.add(entry);
  }

  return { status: 200 };
};

const getBeers = async () => {
  const docRef = db
    .collection('beers')
    .orderBy('priceValidUntil')
    .where('priceValidUntil', '>=', new Date());

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
        if (
          !output.some(
            (item) =>
              item.shortName === doc.data().shortName &&
              item.productMeasure === doc.data().productMeasure &&
              item.supermarket === doc.data().supermarket
          )
        ) {
          output.push(doc.data());
        }
      });
      console.log('output', output);

      return output;
    })
    .catch((err) => {
      console.log('Error getting document', err);
    });

  return data;
};

export { addBeers, getBeers };
