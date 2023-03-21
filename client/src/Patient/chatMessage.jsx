const ChatMessage = ({ type, message }) => {
  return (
    <div className={type}>
      <div className="message">
        <p>{message}</p>
      </div>
    </div>
  );
};
export default ChatMessage;
