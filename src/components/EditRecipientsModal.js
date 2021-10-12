import { useState } from "react";
import { usePayouts } from "../providers/PayoutsProvider";

function EditRecipientsModal({ payeeInfo, hideModal }) {
  const payouts = usePayouts();
  const [addressInputValue, setAddressInputValue] = useState(payeeInfo.accountAddress);
  const [splitInputValue, setSplitInputValue] = useState(payeeInfo.split);
  const [error, setError] = useState();

  const addPayee = async () => {
    try {
      const transaction = await payouts.addPayee(addressInputValue, splitInputValue);
      await transaction.wait();
      setAddressInputValue();
      setSplitInputValue();
      hideModal(true);
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  const editPayee = async () => {
    try {
      const transaction = await payouts.editPayee(payeeInfo.accountAddress, addressInputValue, splitInputValue);
      await transaction.wait();
      setAddressInputValue();
      setSplitInputValue();
      hideModal(true);
    } catch (err) {
      console.log("Error: ", err)
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
        <input 
          value={splitInputValue}
          onChange={e => setSplitInputValue(e.target.value)} 
          placeholder="Enter payee split..." 
        />
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