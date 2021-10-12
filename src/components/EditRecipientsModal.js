import { useState } from "react";
import { usePayouts } from "../providers/PayoutsProvider";

function EditRecipientsModal({ payeeInfo, hideModal }) {
  const payouts = usePayouts();
  const [addressInputValue, setAddressInputValue] = useState(payeeInfo.accountAddress);
  const [splitInputValue, setSplitInputValue] = useState(payeeInfo.split);
  const [error, setError] = useState();

  const addPayee = async () => {
    try {
      if (!addressInputValue) {
        throw new Error("You must provide a recipient address.")
      }
      const transaction = await payouts.addPayee(addressInputValue, splitInputValue);
      await transaction.wait();
      setAddressInputValue();
      setSplitInputValue();
      hideModal(true);
    } catch (err) {
      console.log(err)
    }
  }

  const editPayee = async () => {
    try {
      if (!addressInputValue) {
        throw new Error("You must provide a recipient address.")
      }
      const transaction = await payouts.editPayee(payeeInfo.accountAddress, addressInputValue, splitInputValue);
      await transaction.wait();
      setAddressInputValue();
      setSplitInputValue();
      hideModal(true);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="Backdrop">
      <div className="Card Modal">
        <h2>{payeeInfo ? "Edit" : "Add"} recipient</h2>
        <label>Address</label>
        <input 
          value={addressInputValue} 
          onChange={e => setAddressInputValue(e.target.value)} 
          placeholder="Enter payee address..." 
        />
        <label>Split</label>
        <select 
          value={splitInputValue}
          onChange={e => setSplitInputValue(e.target.value)} 
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
        </select>
        {error && <div className="Error">{error}</div>}
        <div className="ButtonRow">
          {payeeInfo ?
            <button onClick={editPayee}>Save changes</button> :
            <button onClick={addPayee}>Add payee</button> 
          }
          <button onClick={() => hideModal(false)}>Cancel</button>
        </div>
      </div> 
    </div>
  )
}
    
export default EditRecipientsModal;