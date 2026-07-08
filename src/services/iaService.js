const API_URL = import.meta.env.VITE_API_URL;


export async function sendAIMessage(token, messages, mode) {

  const response = await fetch(
    `${API_URL}/api/ai/chat`,
    {
      method: "POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify({
        mode,
        messages
      })
    }
  );


  if(response.status === 403){
    throw new Error("PRO_ONLY");
  }


  if(response.status === 401){
    throw new Error("UNAUTHORIZED");
  }


  if(response.status === 500){
    throw new Error("SERVER_ERROR");
  }


  const data = await response.json();

  return data.data.answer;

}