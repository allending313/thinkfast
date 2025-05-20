import { useState } from "react"
import React from "react"
import HealthBar from "../components/games/HealthBar"

const TestPage: React.FC = () => {
    const [count, setCount] = useState(5)
    
    return (
      <div>
        <HealthBar health={count} maxHealth={5} />
        <button
          onClick={() => {
            setCount(count - 1);
            console.info(count);
          }}
        >
          DECREASE
        </button>
        <br></br>
        <button
          onClick={() => {
            setCount(count + 1);
            console.info(count);
          }}
        >
          INCREASE
        </button>
      </div>
    );
}

export default TestPage