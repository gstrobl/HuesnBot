const brands = [
  {
    type: 'Wieselburger',
    values: ['Gold', 'Stammbräu'],
    productMeasure: ['0.33', '0.50'],
  },
];

const shortName = (name, brandData) => {
  const shortNameOuput = brandData.values.filter((val) => {
    if (name.includes(val)) {
      return val;
    }
    return null;
  });
  return shortNameOuput.length > 0 ? `${brandData.type} ${shortNameOuput[0]}` : brandData.type;
};

const mesure = (name, brandData) => {
  const mesureOutput = brandData.productMeasure.filter((val) => {
    if (name.includes(val)) {
      return val;
    }
    return null;
  });
  return mesureOutput[0] || null;
};

const priceCalcutation = (item) => {
  const box = /.(k|K)iste/.test(item.name) || /.20/.test(item.name);
  return {
    box,
    lowPrice: item.offers?.lowPrice || 0,
    highPrice: item.offers?.highPrice || 0,
    lowPricePerItem: box ? parseFloat(item.offers.lowPrice / 20).toFixed(2) : item.offers.lowPrice,
    priceValidUntil: new Date(item.offers?.priceValidUntil),
  };
};

const classifyProduct = (item, brand) => {
  const brandEntry = brands.find((entry) => entry.type.toLowerCase() === brand);

  const product = {
    shortName: shortName(item.name, brandEntry),
    productMeasure: mesure(item.name, brandEntry),
    ...priceCalcutation(item, brandEntry),
  };
  return product;
};

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

const getSubstringItem = (text, substringsArray) => {
  return substringsArray.find((substring) => text.includes(substring));
};

export { isEmpty, classifyProduct, priceCalcutation, getSubstringItem };
