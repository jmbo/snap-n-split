import { useState } from "react";
import UploadBill from "./UploadBill";
import { ApplySplits } from "./ApplySplits";
import { ViewTotals } from "./ViewTotals";

const people = [
  { name: "Person 1", balance: 0 },
  { name: "Person 2", balance: 0 },
];

const bill = {
  items: [
    {
      quantity: 4,
      description: "#1 Captain Crunch FT",
      total: 80.0,
      splits: [],
    },
    { quantity: 1, description: "autumn", total: 17.95, splits: [] },
    { quantity: 1, description: "G&Gs Scramble", total: 15.0, splits: [] },
  ],
  subtotal: 223.85,
  salesTaxPercentage: 6,
  totalSalesTax: 13.43,
  gratuityPercentage: 20,
  gratuityPreTax: true,
  gratuityTotal: 44.77,
  total: 282.05,
};

const steps = [
  <UploadBill />,
  <ApplySplits bill={bill} people={people} />,
  <ViewTotals />,
];

export default function App() {
  const [step, setStep] = useState(1);

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <h1>Snap 'N Split</h1>

      <div className="main-container">{steps[step - 1]}</div>

      <div
        className={`buttons ${step === 1 ? "right" : ""}
            ${step === steps.length ? "left" : ""}`}
      >
        <Button
          className={step === 1 ? "hidden" : ""}
          onClick={() => setStep((s) => s - 1)}
        >
          Previous Step
        </Button>
        <Button
          className={step === steps.length ? "hidden" : ""}
          onClick={() => setStep((s) => s + 1)}
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}

function Button({ className, onClick, children }) {
  return (
    <button className={className} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
}
