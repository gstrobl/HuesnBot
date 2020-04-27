import { db } from 'controllers/config';
import { classifyProduct, isEmpty } from 'utils/formatter';

const addBeers = ({ pageContent, groceryStores, brand }) => {
  const docRef = db.collection('beers');

  let index = 0;
  pageContent.map((item) => {
    const data = JSON.parse(item);
    let entry = {};
    if (/.*(f|F)lasche$/.test(data.name)) {
      entry = {
        name: data.name,
        supermarket: groceryStores[index],
        type: 'bottle',
        ...classifyProduct(data, brand),
      };
    }
    if (/.*(d|D)ose$/.test(data.name)) {
      entry = {
        name: data.name,
        supermarket: groceryStores[index],
        type: 'can',
        ...classifyProduct(data, brand),
      };
    }
    index += 1;
    if (!isEmpty(entry)) {
      docRef.add(entry);
    }
    return null;
  });
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
              item.supermarket === doc.data().supermarket,
          )
        ) {
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

export { addBeers, getBeers };
