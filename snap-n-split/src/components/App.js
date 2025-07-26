import { useState } from "react";
import UploadBill from "./UploadBill";
import { ManagePeople } from "./ManagePeople";
import { ApplySplits } from "./ApplySplits";
import { ViewTotals } from "./ViewTotals";
import { People, Bill } from "./DataModel";

// import { cloneDeep } from "lodash";
const peopleData = new People();
const billData = new Bill();

peopleData.addPerson("Jose");
peopleData.addPerson("Markus");

billData.addItem(4, "#1 Captain Crunch FT", 80.0);
billData.addItem(1, "Autumn", 17.95);
billData.addItem(1, "G&Gs Scramble", 15.0);

export default function App() {
  const [step, setStep] = useState(1);
  const [people, setPeople] = useState(peopleData.getData());
  const [bill, setBill] = useState(billData.getData());

  const steps = [
    <UploadBill />,
    <ManagePeople
      people={people}
      onAdd={handleAddPerson}
      onRemove={handleRemovePerson}
    />,
    <ApplySplits
      bill={bill}
      people={people}
      onRemove={handleRemoveItem}
      onSplit={handleSplitItem}
      onAddItem={handleAddItem}
    />,
    <ViewTotals />,
  ];

  // Add/remove handlers
  function handleAddPerson(name) {
    // setPeople((prev) => [...prev, { id: Date.now(), name, balance: 0 }]);
    setPeople(peopleData.addPerson(name));
  }
  function handleRemovePerson(id) {
    // setPeople((prev) => prev.filter((p) => p.id !== id));
    setPeople(peopleData.removePerson(id));

    // setBill((prevBill) => ({
    //   ...prevBill,
    //   items: prevBill.items.map((item) => ({
    //     ...item,
    //     splits: item.splits.filter((split) => split.peopleID !== id),
    //   })),
    // }));
    setBill(billData.removePersonSplits(id));
  }

  function handleAddItem(newItem) {
    // setBill((prevBill) => ({
    //   ...prevBill,
    //   items: [
    //     ...prevBill.items,
    //     {
    //       id: Date.now(),
    //       quantity: newItem.quantity,
    //       description: newItem.description,
    //       total: newItem.total,
    //       splits: [{ peopleID: 0, quantity: newItem.quantity }],
    //     },
    //   ],
    // }));
    setBill(
      billData.addItem(newItem.quantity, newItem.description, newItem.total)
    );
  }
  function handleRemoveItem(id) {
    // setBill({ ...bill, items: bill.items.filter((item) => item.id !== id) });
    setBill(billData.removeItem(id));
  }

  function handleSplitItem(
    id,
    oldQuantity,
    newQuantity,
    oldPersonID,
    newPersonID
  ) {
    console.log(id, oldQuantity, newQuantity, oldPersonID, newPersonID);

    // let newSplits = structuredClone(
    //   bill.items.find((item) => item.id === id)?.splits
    // );

    // console.log(newSplits);
    console.log(billData.getData());

    if (oldPersonID !== newPersonID) {
      // person of split changed, so:
      // check if new person exists and assign new quantity to new person
      //   newSplits = newSplits.some((el) => el.peopleID === newPersonID)
      //     ? newSplits.map((el) =>
      //         el.peopleID === newPersonID
      //           ? { ...el, quantity: el.quantity + newQuantity }
      //           : el
      //       )
      //     : [...newSplits, { peopleID: newPersonID, quantity: newQuantity }];

      billData.splitItemAdd(id, newPersonID, newQuantity);

      // and remove from old
      //   newSplits = newSplits.map((el) =>
      //     el.peopleID === oldPersonID
      //       ? { ...el, quantity: el.quantity - newQuantity }
      //       : el
      //   );
      billData.splitItemRemove(id, oldPersonID, newQuantity);
    } else {
      // person remains the same, but quantity is changed so:
      //  modify person's split
      //   newSplits = newSplits.map((el) =>
      //     el.peopleID === newPersonID ? { ...el, quantity: newQuantity } : el
      //   );
      billData.splitItemUpdate(id, newPersonID, newQuantity);
      // and add difference to 0 person (unallocated split)
      //   newSplits = newSplits.map((el) =>
      //     el.peopleID === 0
      //       ? { ...el, quantity: el.quantity - (newQuantity - oldQuantity) }
      //       : el
      //   );
      billData.splitItemAdd(id, 0, newQuantity - oldQuantity);
    }
    // console.log(newSplits);

    // setBill({
    //   ...bill,
    //   items: bill.items.map((item) =>
    //     item.id === id ? { ...item, splits: newSplits } : item
    //   ),
    // });

    console.log(billData.getData());
    setBill(billData.getData());
  }

  return (
    <div className="App">
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
