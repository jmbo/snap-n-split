import React, { useState } from "react";

// New ManagePeople component
export function ManagePeople({ people, onAdd, onRemove }) {
  const [name, setName] = useState("");

  return (
    <>
      <h3> 👨‍🤝‍👩 Manage People 🧑‍🤝‍🧑🕴️</h3>
      <div className="manage-people">
        <ul className="people-list">
          {people.map((p) => (
            <li key={p.id} className="people-list-item">
              <span className="person-name">{p.name}</span>
              <button
                className="remove-btn"
                onClick={() => onRemove(p.id)}
                disabled={people.length <= 1}
                title={
                  people.length <= 1 ? "At least one person required" : "Remove"
                }
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
        <div className="add-person-row">
          <input
            className="add-person-input"
            type="text"
            placeholder="Add person"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) {
                onAdd(name.trim());
                setName("");
              }
            }}
          />
          <button
            className="add-btn"
            onClick={() => {
              if (name.trim()) {
                onAdd(name.trim());
                setName("");
              }
            }}
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
}
