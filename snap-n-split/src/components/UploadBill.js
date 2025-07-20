export default function UploadBill() {
  return (
    <>
      <h3>🧾 Upload the Bill</h3>
      <p>
        This step is optional. Upload an itemized bill to OCR. Otherwise,
        manually input items on the next step.
      </p>
      <input type="file" accept="image/*" />
    </>
  );
}
