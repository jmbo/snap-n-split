export function ApplySplits({ bill }) {
  return (
    <>
      <h3>➗ Apply the Splits</h3>
      <p> Click on each item and assign to individuals</p>
      <div className="list">
        <ul>
          {bill.items.map((item) => (
            <Item item={item} />
          ))}
        </ul>
      </div>
      <ion-icon name="add-circle-outline"></ion-icon>
    </>
  );
}

export function Item({ item }) {
  return (
    <li>
      <div className="item-listing">
        <div className="">
          <span>{item.quantity}</span>
          <span>{item.description}</span>
        </div>
        <div className="right">
          <span>${item.total.toFixed(2)}</span>
        </div>
      </div>
      <div className="split-container">
        <div className="split">
          <input type="number" placeholder="4"></input>
          <select>
            <option></option>
            <option>"Person 1"</option>
            <option>"Person 2"</option>
          </select>
        </div>
      </div>
    </li>
  );
}
