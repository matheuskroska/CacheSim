import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);
  const [summary, setSummary] = useState([]);

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
      hitRate: (hit / (hit + miss)).toFixed(2),
      cacheStep,
    };
  }

  const handleDirectMappingCache = (event) => {
    const sumary = directMappingCache(
      memObj[event.target.value].data,
      memObj[event.target.value].cacheSize
    );

    setSummary(sumary);
  };

  const memObj = [
    { data: [0, 1, 2, 3, 1, 4, 5, 6], cacheSize: 5 },
    { data: [0, 1, 2, 2, 22, 32, 42, 20, 1, 10, 11, 12, 13], cacheSize: 10 },
    { data: [1, 6, 1, 11, 1, 16, 1, 21, 1, 26], cacheSize: 8 },
  ];

  useEffect(() => {
    const sumary = directMappingCache(
      memObj[selectedValue].data,
      memObj[selectedValue].cacheSize
    );

    setSummary(sumary);
  }, []);

  return (
    <>
      <div className="stepTitle">
        <h1>Mapeamento Direto</h1>
        <select onChange={handleDirectMappingCache}>
          <option value="0">
            Endereços da memória = [0,1,2,3,1,4,5,6], Tamanho da cache = 5
          </option>
          <option value="1">[0,1,2,2,22,32,42,20,1,10,11,12,13], 10</option>
          <option value="2">[1,6,1,11,1,16,1,21,1,26], 8</option>
        </select>

        <div className="summary">
          <span>
            <p>Hit: </p>
            <b className="summaryHit">{summary.hit}</b>
          </span>
          <span>
            <p>Miss: </p>
            <b className="summaryMiss">{summary.miss}</b>
          </span>
          <span>
            <p>Hit Rate: </p>
            <b className="summaryHitRate">{summary.hitRate}</b>
          </span>
        </div>
      </div>

      <div className="stepContainer">
        {step &&
          step.map((item, index) => {
            return (
              <div className="stepCard" key={index}>
                <p className="stepIndex">Step - {index + 1}</p>
                <table>
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
                    );
                  })}
                </table>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default App;
