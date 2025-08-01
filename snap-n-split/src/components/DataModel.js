export class People {
  #data = [];

  *numIdGen(seed = Date.now()) {
    while (true) yield seed++;
  }

  constructor() {
    this.idGenerator = this.numIdGen();
  }

  getData() {
    return JSON.parse(JSON.stringify(this.#data));
  }

  addPerson(name) {
    this.#data.push({
      id: this.idGenerator.next().value,
      name,
      balance: {
        subtotal: 0,
        salesTax: 0,
        gratuity: 0,
        total: 0,
      },
    });

    return this.getData();
  }

  removePerson(id) {
    this.#data = this.#data.filter((p) => p.id !== id);

    return this.getData();
  }

  updatePersonTotals(id, newTotals) {
    const person = this.#data.find((p) => p.id === id);
    if (!person) return;

    person.balance = {
      ...person.balance,
      ...newTotals,
    };

    return this.getData();
  }

  isMinMax(id) {
    const person = this.#data.find((p) => p.id === id);
    if (!person) return false;

    const total = person.balance.total;
    let min = true;
    let max = true;

    this.#data.forEach((p) => {
      if (p.id !== id) {
        if (p.balance.total < total) min = false;
        if (p.balance.total > total) max = false;
      }
    });

    // return total === 0 || total === Infinity || total === -Infinity;
    return min || max;
  }
}

export class Bill {
  #data = {
    items: [],
    salesTaxPercentage: 0,
    gratuityPercentage: 0,
    gratuityPreTax: true,
    subtotal: 0,
    totalSalesTax: 0,
    totalGratuity: 0,
    total: 0,
  };

  *numIdGen(seed = Date.now()) {
    while (true) yield seed++;
  }

  constructor() {
    this.idGenerator = this.numIdGen();
  }

  #calculateTaxAndTotals() {
    this.#data.totalSalesTax =
      (this.#data.subtotal * this.#data.salesTaxPercentage) / 100;
    this.#data.totalGratuity =
      this.#data.gratuityPreTax === true
        ? (this.#data.subtotal * this.#data.gratuityPercentage) / 100
        : ((this.#data.subtotal + this.#data.totalSalesTax) *
            this.#data.gratuityPercentage) /
          100;
    this.#data.total =
      this.#data.subtotal + this.#data.totalSalesTax + this.#data.totalGratuity;
  }

  getData() {
    return JSON.parse(JSON.stringify(this.#data));
  }

  addItem(quantity, description, total) {
    const newItem = {
      id: this.idGenerator.next().value,
      quantity,
      description,
      total,
      splits: [{ personID: 0, quantity }],
    };

    this.#data.subtotal += total;
    this.#calculateTaxAndTotals();

    this.#data.items.push(newItem);

    return this.getData();
  }

  removeItem(id) {
    const item = this.#data.items.find((item) => item.id === id);
    if (!item) return;

    this.#data.subtotal -= item.total;
    this.#calculateTaxAndTotals();

    this.#data.items = this.#data.items.filter((item) => item.id !== id);

    return this.getData();
  }

  splitItemAdd(itemId, personID, quantity) {
    const item = this.#data.items.find((item) => item.id === itemId);
    if (!item) return;

    const existingSplit = item.splits.find(
      (split) => split.personID === personID
    );
    if (existingSplit) {
      existingSplit.quantity += quantity;
    } else {
      item.splits.push({ personID: personID, quantity });
    }

    return this.getData();
  }

  splitItemUpdate(itemId, personID, quantity) {
    const item = this.#data.items.find((item) => item.id === itemId);
    if (!item) return;

    const existingSplit = item.splits.find(
      (split) => split.personID === personID
    );
    if (existingSplit) {
      existingSplit.quantity = quantity;
    } else {
      item.splits.push({ personID: personID, quantity });
    }

    return this.getData();
  }

  splitItemRemove(itemId, personID, quantity) {
    const item = this.#data.items.find((item) => item.id === itemId);
    if (!item) return;

    const existingSplit = item.splits.find(
      (split) => split.personID === personID
    );
    if (existingSplit) {
      existingSplit.quantity -= quantity;
    }

    return this.getData();
  }

  removeItemSplit(itemId, personID) {
    const item = this.#data.items.find((item) => item.id === itemId);
    if (!item) return;

    item.splits = item.splits.filter((split) => split.personID !== personID);

    return this.getData();
  }

  getItemSplit(itemId, personID) {
    const item = this.#data.items.find((item) => item.id === itemId);
    if (!item) return;

    return item.splits.find((split) => split.personID === personID);
  }

  removePersonSplits(personID) {
    this.#data.items.forEach((item) => {
      //   item.splits = item.splits.filter((split) => split.personID !== personID);
      this.removeItemSplit(item.id, personID);
    });

    return this.getData();
  }

  setSalesTaxPercentage(percentage) {
    this.#data.salesTaxPercentage = percentage;
    this.#calculateTaxAndTotals();

    return this.getData();
  }

  setSalesTax(amount) {
    this.setSalesTaxPercentage((amount / this.#data.subtotal) * 100);
    this.#calculateTaxAndTotals();

    return this.getData();
  }

  setGratuityPercentage(percentage) {
    this.#data.gratuityPercentage = percentage;
    this.#calculateTaxAndTotals();

    return this.getData();
  }

  setGratuity(amount) {
    this.setGratuityPercentage((amount / this.#data.subtotal) * 100);
    this.#calculateTaxAndTotals();

    return this.getData();
  }

  setGratuityPreTax(preTax) {
    this.#data.gratuityPreTax = preTax;
    this.#calculateTaxAndTotals();

    return this.getData();
  }

  getPersonTotals(personID) {
    const personTotals = {
      subtotal: 0,
      salesTax: 0,
      gratuity: 0,
      total: 0,
    };

    this.#data.items.forEach((item) => {
      const split = item.splits.find((s) => s.personID === personID);
      if (split) {
        personTotals.subtotal += (split.quantity * item.total) / item.quantity;
      }
    });

    personTotals.salesTax =
      (personTotals.subtotal * this.#data.salesTaxPercentage) / 100;
    personTotals.gratuity = this.#data.gratuityPreTax
      ? (personTotals.subtotal * this.#data.gratuityPercentage) / 100
      : ((personTotals.subtotal + personTotals.salesTax) *
          this.#data.gratuityPercentage) /
        100;
    personTotals.total =
      personTotals.subtotal + personTotals.salesTax + personTotals.gratuity;

    return personTotals;
  }
}
