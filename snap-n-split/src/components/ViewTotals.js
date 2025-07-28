export function ViewTotals({ people, bill }) {
  return (
    <>
      <h3>🤑 View Totals</h3>
      <p>Here are the total splits:</p>
      <div className="data-container list">
        <ul>
          {people.map((person) => (
            <TotalItem person={person} key={person.id} />
          ))}
        </ul>
      </div>
    </>
  );
}

function TotalItem({ person }) {
  return (
    <li>
      <div className="people-list">
        <strong>{person.name}</strong>
        <strong>Total: ${person.balance.total.toFixed(2)}</strong>
        <p>
          <br />
          <span> Subtotal: ${person.balance.subtotal.toFixed(2)}</span>
          <span> Tax: ${person.balance.salesTax.toFixed(2)}</span>
          <span> Tip: ${person.balance.gratuity.toFixed(2)}</span>
        </p>
      </div>
    </li>
  );
}
