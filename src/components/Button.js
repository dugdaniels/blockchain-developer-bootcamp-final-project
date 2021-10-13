function Button({ onClick, loading, children }) {

  return loading ? 
      <div className="Loader">Transaction pending...</div> :
      <button onClick={onClick}>{children}</button>;
}
    
export default Button;