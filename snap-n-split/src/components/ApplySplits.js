export function ApplySplits({ bill, people, onRemove, onSplit, onAddItem }) {
  return (
    <>
      <h3>➗ Apply the Splits</h3>
      <p> Click on each item and assign to individuals</p>
      <div className="data-container list">
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
        <ion-icon name="add-circle-outline"></ion-icon>
      </div>
      <div className="data-container">
        <div className="totals">
          <span>Bill Subtotal</span>
          <span>${bill.subtotal.toFixed(2)}</span>
        </div>

        <div className="totals">
          <span className="first">Sales Tax</span>
          <span>
            <input type="text" value={bill.salesTaxPercentage} /> %
          </span>
          <span>
            $ <input type="text" value={bill.totalSalesTax.toFixed(2)} />
          </span>
        </div>
        <div className="totals">
          <span>Gratuity is pre-tax?</span>
          <span>
            <input type="checkbox" checked={bill.gratuityPreTax} />
          </span>
        </div>
        <div className="totals">
          <span className="first">Gratuity</span>
          <span>
            <input type="number" value={bill.gratuityPercentage} /> %
          </span>
          <span>
            $ <input type="text" value={bill.totalGratuity.toFixed(2)} />
          </span>
        </div>
        <div className="totals total">
          <span>Total</span>
          <span>${bill.total.toFixed(2)}</span>
        </div>
      </div>
      <br />
    </>
  );
}

function Item({ item, people, onRemove, onSplit }) {
  const currentSplits = item.splits
    .filter((split) => split.personID !== 0)
    .reduce((cur, t) => cur + t.quantity, 0);
  const remainingSplits = item.quantity - currentSplits;

  function handleSplitContainerToggle(e) {
    const itemListing = e.currentTarget.querySelector(".item-listing");
    const splitContainer = e.currentTarget.querySelector(".split-container");

    if (!itemListing.contains(e.target)) return;

    const list = e.currentTarget.parentNode;
    const allSplitContainers = list.querySelectorAll(".split-container");

    allSplitContainers.forEach((container) => {
      if (container !== splitContainer) {
        container.classList.add("hidden");
      }
    });

    splitContainer.classList.toggle("hidden");
  }

  function handleSplit(...params) {
    onSplit(item.id, ...params);
  }

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
        {item.splits
          .filter((split) => split.personID !== 0 && split.quantity !== 0)
          .map(({ quantity, personID }) => (
            <Split
              quantity={quantity}
              remainingSplits={remainingSplits}
              personID={personID}
              people={people}
              onSplit={handleSplit}
              key={personID}
            />
          ))}
        {remainingSplits > 0 && (
          <Split
            quantity={remainingSplits}
            remainingSplits={remainingSplits}
            personID={0}
            people={people}
            onSplit={handleSplit}
            key={0}
          />
        )}
      </div>
    </li>
  );
}

function Split({ quantity, remainingSplits, personID, people, onSplit }) {
  //   const [localPersonID, setLocalPersonID] = useState(personID);
  //   const [localQuantity, setLocalQuantity] = useState(quantity);

  function handleSplitChange(target) {
    const parent = target.parentNode;
    const newQuantity =
      parent.querySelector("input").value === ""
        ? parent.querySelector("input").placeholder
        : parent.querySelector("input").value;

    const newPersonID = parent.querySelector("select").value;

    onSplit(quantity, +newQuantity, personID, +newPersonID);

    // debugger;
    if (personID === 0 && +newPersonID !== 0)
      parent.querySelector("input").value = "";
  }

  return (
    <div className="split">
      {personID === 0 && (
        <input
          type="number"
          min="0"
          step="0.5"
          max={remainingSplits}
          placeholder={remainingSplits}
          onChange={(e) => handleSplitChange(e.target)}
        ></input>
      )}
      {personID !== 0 && (
        <input
          type="number"
          min="0"
          step="0.5"
          max={quantity + remainingSplits}
          value={quantity}
          onChange={(e) => handleSplitChange(e.target)}
        ></input>
      )}
      <select value={personID} onChange={(e) => handleSplitChange(e.target)}>
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
