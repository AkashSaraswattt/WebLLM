import * as webllm from "@mlc-ai/web-llm";
import { useEffect, useState } from "react";

function App() {
  const [engine, setEngine] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", message: "Hello! How can I assist you today?" },
  ]);

  useEffect(() => {
    const selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-MLC";
    webllm
      .CreateMLCEngine(selectedModel, {
        initProgressCallback: (initProgress) => {
          console.log("Engine initialized with progress:", initProgress);
        },
      })
      .then((engine) => {
        setEngine(engine);
      });
  }, []);

  async function sendMessage(input) {
    if (!engine) {
      console.error("Engine not initialized");
      return;
    }
    const newMessage = { role: "User", message: input };
    setMessages([...messages, newMessage]);
    setInput("");

    await engine.chat.completions
      .create({ messages: newMessage })
      .then((reply) => {
        const text = reply.choices[0].message.content;

        setMessages([
          ...newMessage,
          {
            role: "assistant",
            message: text,
          },
        ]);
      });
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <section className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-xl">
          <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            💬 Chat App
          </h1>
          <div className="conversation flex flex-col gap-4">
            <div className="messages flex flex-col gap-3 max-h-96 overflow-y-auto px-2 py-2 bg-gray-50 rounded-lg border border-gray-200">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message max-w-[75%] px-4 py-2 rounded-lg shadow-sm ${
                    msg.role === "assistant"
                      ? "bg-indigo-100 text-indigo-900 self-start rounded-bl-none"
                      : "bg-pink-200 text-pink-900 self-end rounded-br-none"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-center mt-2">
              <input
                type="text"
                name="message"
                placeholder="Ask anything..."
                required
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white shadow"
                onChange={(e) => setInput(e.target.value)}
                value={input}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage(input);
                  }
                }}
              />
              <button
                type="button"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2 rounded-full shadow transition"
                onClick={() => sendMessage(input)}
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
