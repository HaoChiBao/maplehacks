function ChatMessage(props){
    return (
        <div className={props.type}>
            <div className="message">
               <p>{props.message}</p>
            </div>
        </div>
    )
}
export default ChatMessage;