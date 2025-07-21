export function ApplySplits({ bill, people }) {
  return (
    <>
      <h3>➗ Apply the Splits</h3>
      <p> Click on each item and assign to individuals</p>
      <div className="list">
        <ul>
          {bill.items.map((item) => (
            <Item item={item} people={people} key={item.id} />
          ))}
        </ul>
      </div>
      <ion-icon name="add-circle-outline"></ion-icon>
    </>
  );
}

function Item({ item, people }) {
  function handleSplitContainerToggle(e) {
    const itemListing = e.currentTarget.querySelector(".item-listing");
    const splitContainer = e.currentTarget.querySelector(".split-container");

    if (e.target !== itemListing) return;

    splitContainer.classList.toggle("hidden");
  }

  return (
    <li onClick={handleSplitContainerToggle}>
      <div className="item">
        <div
          className={`item-listing ${
            item.splits.reduce((cur, t) => cur + t.quantity, 0) ===
            item.quantity
              ? "good-split"
              : ""
          }`}
        >
          <div>
            <span>{item.quantity}</span>
            <span>{item.description}</span>
          </div>
          <div className="right">
            <span>${item.total.toFixed(2)}</span>
          </div>
        </div>
        <span className="item-remove">❌</span>
      </div>

      <div className="split-container hidden">
        <Split item={item} people={people} />
      </div>
    </li>
  );
}

// {
//   id: 2,
//   quantity: 1,
//   description: "Autumn",
//   total: 17.95,
//   splits: [{ quantity: 1, peopleID: 1 }],
// },

// const people = [
//   { id: 1, name: "Jose", balance: 0 },
//   { id: 2, name: "Markus", balance: 0 },
// ];

function Split({ item, people }) {
  const remainingSplits =
    item.quantity - item.splits.reduce((cur, t) => cur + t.quantity, 0);

  return (
    <>
      {item.splits.map(({ quantity, peopleID }) => (
        <div className="split">
          <input type="number" placeholder={quantity}></input>
          <select value={peopleID}>
            <option value={0} key={0}></option>
            {people.map((person) => (
              <option value={person.id} key={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>
      ))}
      {remainingSplits > 0 && (
        <div className="split">
          <input type="number" placeholder={remainingSplits}></input>
          <select>
            <option value={0} key={0}></option>
            {people.map((person) => (
              <option value={person.id} key={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}
