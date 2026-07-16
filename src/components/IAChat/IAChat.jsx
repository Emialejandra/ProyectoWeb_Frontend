import { useEffect, useRef, useState } from "react";
import { sendAIMessage } from "../../services/iaService";
import "./IAChat.css";


export default function IAChat() {


   const [messages, setMessages] = useState([]);

   const [input, setInput] = useState("");

   const mode = "financial";

   const [loading, setLoading] = useState(false);


   const bottomRef = useRef(null);


   const token = localStorage.getItem("token");



   useEffect(() => {

      bottomRef.current?.scrollIntoView({
         behavior: "smooth"
      });

   }, [messages, loading]);




   const handleSend = async () => {


      if (!input.trim() || loading) return;


      const userMessage = {
         role: "user",
         content: input
      };


      const newMessages = [
         ...messages,
         userMessage
      ];


      setMessages(newMessages);
      setInput("");
      setLoading(true);



      try {


         const answer = await sendAIMessage(
            token,
            newMessages,
            mode
         );


         setMessages(prev => [
            ...prev,
            {
               role: "assistant",
               content: answer
            }
         ]);



      } catch (error) {


         if (error.message === "PRO_ONLY") {

            setMessages(prev => [
               ...prev,
               {
                  role: "assistant",
                  content: "Disponible únicamente para usuarios PRO"
               }
            ]);

         }


         else if (error.message === "UNAUTHORIZED") {

            window.location.href = "/login";

         }


         else {

            setMessages(prev => [
               ...prev,
               {
                  role: "assistant",
                  content: "Ocurrió un error al comunicarse con la IA"
               }
            ]);

         }


      }


      finally {

         setLoading(false);

      }


   };




   const handleKeyDown = (e) => {


      if (e.key === "Enter" && !e.shiftKey) {

         e.preventDefault();
         handleSend();

      }


   };



   const clearChat = () => {

      setMessages([]);

   };



   return (

      <div className="ai-chat">


         <div className="ai-header">

            <h2>
               Asistente IA
            </h2>


            <div className="ai-mode">
               <span>Asistente Financiero</span>
            </div>


         </div>



         <div className="ai-messages">


            {
               messages.map((msg, index) => (

                  <div
                     key={index}
                     className={
                        `message ${msg.role}`
                     }
                  >

                     <strong>
                        {
                           msg.role === "user"
                              ? "Tú:"
                              : "IA:"
                        }
                     </strong>

                     <p>
                        {msg.content}
                     </p>

                  </div>

               ))
            }


            {
               loading &&
               <div className="message assistant">
                  Pensando...
               </div>
            }


            <div ref={bottomRef} />


         </div>



         <textarea

            value={input}

            onChange={
               (e) => setInput(e.target.value)
            }

            onKeyDown={handleKeyDown}

            placeholder="Escribe tu pregunta..."

            disabled={loading}

         />



         <div className="ai-buttons">


            <button
               onClick={handleSend}
               disabled={loading}
            >

               {
                  loading
                     ? "Pensando..."
                     : "Enviar"
               }

            </button>


            <button
               onClick={clearChat}
            >

               Limpiar

            </button>


         </div>



      </div>

   );


}