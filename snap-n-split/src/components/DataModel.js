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
      balance: 0,
    });

    return this.getData();
  }

  removePerson(id) {
    this.#data = this.#data.filter((p) => p.id !== id);

    return this.getData();
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
    gratuityTotal: 0,
    total: 0,
  };

  *numIdGen(seed = Date.now()) {
    while (true) yield seed++;
  }

  constructor() {
    this.idGenerator = this.numIdGen();
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

    this.#data.items.push(newItem);
    this.#data.subtotal += total;
    this.#data.totalSalesTax =
      (this.#data.subtotal * this.#data.salesTaxPercentage) / 100;
    this.#data.gratuityTotal =
      this.#data.gratuityPreTax === true
        ? (this.#data.subtotal * this.#data.gratuityPercentage) / 100
        : ((this.#data.subtotal + this.#data.totalSalesTax) *
            this.#data.gratuityPercentage) /
          100;
    this.#data.total =
      this.#data.subtotal + this.#data.totalSalesTax + this.#data.gratuityTotal;

    return this.getData();
  }

  removeItem(id) {
    const item = this.#data.items.find((item) => item.id === id);
    if (!item) return;

    this.#data.subtotal -= item.total;
    this.#data.totalSalesTax =
      (this.#data.subtotal * this.#data.salesTaxPercentage) / 100;
    this.#data.gratuityTotal =
      this.#data.gratuityPreTax === true
        ? (this.#data.subtotal * this.#data.gratuityPercentage) / 100
        : ((this.#data.subtotal + this.#data.totalSalesTax) *
            this.#data.gratuityPercentage) /
          100;
    this.#data.total =
      this.#data.subtotal + this.#data.totalSalesTax + this.#data.gratuityTotal;

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
}
