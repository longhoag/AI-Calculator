import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// API calls
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Function to evaluate expressions via Gemini API
async function evaluateExpression(expression) {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${import.meta.env.VITE_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: `Evaluate this mathematical expression and output the result only in digits (not latex): ${expression}` }]
          }
        ]
      }
    );

    console.log("Gemini API Response:", response.data);
    
    // Extract the answer from the response
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No response";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to fetch response";
  }
}

function App() {
  const [input, setInput] = useState(""); // User input value
  const [result, setResult] = useState(""); // Result to display
  const [loading, setLoading] = useState(false); // Loading state

  const buttonClasses = "p-4 text-lg font-bold rounded-lg flex justify-center items-center";
  const numberButton = "bg-gray-200 text-black hover:bg-gray-300";
  const operatorButton = "bg-blue-500 text-white hover:bg-blue-600";
  const functionButton = "bg-green-500 text-white hover:bg-green-600";
  const specialButton = "bg-red-500 text-white hover:bg-red-600";
  const equalButton = "bg-green-600 text-white hover:bg-green-700 col-span-4";


  // Handle button click for input values
  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  // Clear the input and result
  const clearInput = () => {
    setInput("");
    setResult("");
  };

  // Handle the calculation logic
  const handleCalculate = async () => {
    if (input.trim() === "") {
      setResult("Please enter a valid mathematical expression.");
      return;
    }
    setLoading(true); // Set loading state
    const result = await evaluateExpression(input); // Call Gemini API
    setResult(result); // Update the UI with result
    setLoading(false); // Turn off loading
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Banner Title */}
      <h1 className="text-4xl font-bold text-gray-700 mb-6">Calculator with AI Evaluation</h1>

      <Card className="w-full max-w-sm shadow-lg">
        <CardContent className="p-4">
          {/* Input Field */}
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full text-xl p-2 border rounded-md mb-2"
            placeholder="Enter expression"
          />
          <div className="text-lg text-gray-600 min-h-[32px]">
            {loading ? "Calculating..." : result}
          </div>
        </CardContent>
      </Card>

      {/* Calculator Buttons */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {/* Numbers and Operations */}
        {[
          7, 8, 9, "/", 
          4, 5, 6, "*",
          1, 2, 3, "-", 
          0, ".", "^", "+",
          "(", ")", "sqrt(", "log(",
          "ln(", "sin(", "cos(", "tan(",
          "exp(", "C", "=",
        ].map((item) => (
          <Button
            key={item}
            className={`p-4 rounded-md text-xl transition-colors duration-200 bg-gray-300 hover:bg-gray-500 ${
              item === "=" ? "bg-green-500 text-white hover:bg-green-700" : 
              item === "C" ? "bg-red-500 text-white hover:bg-red-700" : 
              item === "+" ? "bg-blue-500 text-black hover:bg-blue-700" : 
              item === "-" ? "bg-blue-500 text-black hover:bg-blue-700" :
              item === "*" ? "bg-blue-500 text-black hover:bg-blue-700" :
              item === "/" ? "bg-blue-500 text-black hover:bg-blue-700" :
              "text-black"
            }`}
            onClick={() =>
              item === "=" ? handleCalculate() : item === "C" ? clearInput() : handleClick(item)
            }
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default App;