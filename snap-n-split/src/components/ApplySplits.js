export function ApplySplits({ bill, people, onRemove, onSplit }) {
  return (
    <>
      <h3>➗ Apply the Splits</h3>
      <p> Click on each item and assign to individuals</p>
      <div className="list">
        <ul>
          {bill.items.map((item) => (
            <Item
              item={item}
              people={people}
              onRemove={onRemove}
              onSplit={onSplit}
              key={item.id}
            />
          ))}
        </ul>
      </div>
      <ion-icon name="add-circle-outline"></ion-icon>
    </>
  );
}

function Item({ item, people, onRemove, onSplit }) {
  const currentSplits = item.splits.reduce((cur, t) => cur + t.quantity, 0);
  const remainingSplits = item.quantity - currentSplits;

  function handleSplitContainerToggle(e) {
    // console.log(e.currentTarget);

    const itemListing = e.currentTarget.querySelector(".item-listing");
    const splitContainer = e.currentTarget.querySelector(".split-container");

    if (e.target !== itemListing) return;

    splitContainer.classList.toggle("hidden");
  }

  function handleSplit() {}

  return (
    <li onClick={handleSplitContainerToggle}>
      <div
        className={`item ${
          currentSplits === item.quantity ? "good-split" : ""
        }`}
      >
        <div className="item-listing">
          <div>
            <span>{item.quantity}</span>
            <span>{item.description}</span>
          </div>
          <div className="right">
            <span>${item.total.toFixed(2)}</span>
          </div>
        </div>
        <div className="item-remove">
          <span onClick={() => onRemove(item.id)}>❌</span>
        </div>
      </div>

      <div className="split-container hidden">
        {item.splits.map(({ id, quantity, peopleID }) => (
          <Split
            quantity={quantity}
            peopleID={peopleID}
            people={people}
            onSplit={handleSplit}
            key={id}
          />
        ))}
        {remainingSplits > 0 && (
          <Split
            quantity={remainingSplits}
            peopleID={0}
            people={people}
            onSplit={handleSplit}
            key={0}
          />
        )}
      </div>
    </li>
  );
}

// {
//   id: 2,
//   quantity: 1,
//   description: "Autumn",
//   total: 17.95,
//   splits: [{ id: 1, quantity: 1, peopleID: 1 }],
// },

// const people = [
//   { id: 1, name: "Jose", balance: 0 },
//   { id: 2, name: "Markus", balance: 0 },
// ];

function Split({ quantity, peopleID, people, onSplit }) {
  return (
    <div className="split">
      {peopleID === 0 && (
        <input type="number" placeholder={quantity} onChange={onSplit}></input>
      )}
      {peopleID !== 0 && (
        <input type="number" value={quantity} onChange={onSplit}></input>
      )}
      <select value={peopleID} onChange={onSplit}>
        <option value={0} key={0}></option>
        {people.map((person) => (
          <option value={person.id} key={person.id}>
            {person.name}
          </option>
        ))}
      </select>
    </div>
  );
}
