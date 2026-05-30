export const calculateKpTotal = (listsKp = [], formData = {}) => {
  const totals = {
    byType: {
      eat: { totalWeight: 0, totalPrice: 0 },
      drink: { totalWeight: 0, totalPrice: 0 },
      organisation: { totalPrice: 0 }
    },
    totalPrice: 0
  };

  listsKp.forEach(productGroup => {
    (productGroup.rows || []).forEach(product => {
      const { productWeight, priceOfProduct, countOfProduct, typeOfProduct } = product;

      if (priceOfProduct && countOfProduct) {
        const itemTotal = priceOfProduct * countOfProduct;
        totals.totalPrice += itemTotal;

        // Обработка для типов eat и drink
        if (typeOfProduct === 'eat') {
          totals.byType.eat.totalPrice += itemTotal;
          if (productWeight) {
            const totalWeightForType = productWeight * countOfProduct;
            totals.byType.eat.totalWeight += totalWeightForType;
          }
        } else if (typeOfProduct === 'drink') {
          totals.byType.drink.totalPrice += itemTotal;
          if (productWeight) {
            const totalWeightForType = productWeight * countOfProduct;
            totals.byType.drink.totalWeight += totalWeightForType;
          }
        } else if (typeOfProduct === 'organisation') {
          totals.byType.organisation.totalPrice += itemTotal;
        }
      }
    });
  });

  const numberOfPersons = parseInt(formData.countOfPerson, 10) || 0;
  
  if (numberOfPersons > 0) {
    totals.byType.eat.totalWeightByPerson = (totals.byType.eat.totalWeight / numberOfPersons) || 0;
    totals.byType.drink.totalWeightByPerson = (totals.byType.drink.totalWeight / numberOfPersons) || 0;
  } else {
    totals.byType.eat.totalWeightByPerson = 0;
    totals.byType.drink.totalWeightByPerson = 0;
  }

  const logisticsCost = parseInt(formData.logisticsCost, 10) || 0;
  const finalTotalAmount = totals.totalPrice + logisticsCost;

  return {
    totals,
    finalTotalAmount
  };
};
