import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState([])


  function directMappingCache(memoryAddress, cacheSize) {
  const cache = Array(cacheSize).fill(-1);
  const cacheStep = [];
  let hit = 0;
  let miss = 0;

  for (let i = 0; i < memoryAddress.length; i++) {
    const cacheIndex = memoryAddress[i] % cacheSize;
    if (cache[cacheIndex] === memoryAddress[i]) {
      hit++;
    } else {
      cache[cacheIndex] = memoryAddress[i];
      miss++;
    }
    cacheStep.push([...cache]);
    }
    
    setStep(cacheStep);

  return {
    hit,
    miss,
    hitRate: hit / (hit + miss),
    cacheStep,
  };
  }

  useEffect(() => {
    directMappingCache([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 2);    
  }, [])
  

  return (
    <>
      <h1>Mapeamento Direto</h1>
      {step &&
        step.map((item, index) => {
          return (
            <div key={index}>
              <p className='stepIndex'>Step - {index}</p>
            <table >
              
              <tr>
                <th>Index</th>
                <th>Cache</th>
              </tr>

              {item.map((item, index) => {
                return (
                  <>
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{item}</td>
                    </tr>
                  </>
                )
              })}
              </table>
              </div>
          )
        })
      }
    </>
  )
}

export default App
