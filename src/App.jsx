/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [step, setStep] = useState([]);
  const [stepStatus, setStepStatus] = useState([]);
  const [summary, setSummary] = useState([]);

  function directMappingCache(memoryAddress, cacheSize) {
    const cache = Array(cacheSize).fill(-1);
    const cacheStep = [];
    const cacheStepStatus = [];
    let hit = 0;
    let miss = 0;

    for (let i = 0; i < memoryAddress.length; i++) {
      const cacheIndex = memoryAddress[i] % cacheSize;
      const hitValue = cache[cacheIndex] === memoryAddress[i];
      const access = {
        value: memoryAddress[i],
        cacheIndex: cacheIndex,
        hit: hitValue,
      };
      if (hitValue) {
        hit++;
      } else {
        cache[cacheIndex] = memoryAddress[i];
        miss++;
      }
      cacheStep.push([...cache]);
      cacheStepStatus.push(access);
    }

    setStep(cacheStep);
    setStepStatus(cacheStepStatus);

    return {
      hit,
      miss,
      hitRate: (hit / (hit + miss)).toFixed(2),
      memoryAddress,
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
    { data: [33, 3, 11, 5], cacheSize: 5 },
  ];

  useEffect(() => {
    const sumary = directMappingCache(memObj[0].data, memObj[0].cacheSize);
    setSummary(sumary);
  }, []);

  return (
    <>
      <div className="stepTitle">
        <h1>Mapeamento Direto</h1>
        <select onChange={handleDirectMappingCache}>
          {memObj.map((item, index) => {
            return (
              <option key={index} value={index}>
                Endereços da memória = {item.data.toString()}, Tamanho da cache
                = {item.cacheSize}
              </option>
            );
          })}
        </select>

        <div className="summary">
          <span>
            <p>Hit: </p>
            <b className="summaryHit">
              {summary.hit}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19.875 6.27A2.225 2.225 0 0 1 21 8.218v7.284c0 .809-.443 1.555-1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1-2.184 0l-6.75-4.27A2.225 2.225 0 0 1 3 15.502V8.217c0-.809.443-1.554 1.158-1.947l6.75-3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033zM10 16V8m4 0v8m-4-4h4"
                />
              </svg>
            </b>
          </span>
          <span>
            <p>Miss: </p>
            <b className="summaryMiss">
              {summary.miss}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                >
                  <path d="M19.875 6.27A2.225 2.225 0 0 1 21 8.218v7.284c0 .809-.443 1.555-1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1-2.184 0l-6.75-4.27A2.225 2.225 0 0 1 3 15.502V8.217c0-.809.443-1.554 1.158-1.947l6.75-3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
                  <path d="M9 16V8l3 5l3-5v8" />
                </g>
              </svg>
            </b>
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
            const status = stepStatus[index];
            return (
              <div className="stepCard" key={index}>
                <p className="stepIndex">
                  Passo {index + 1} - Endereço [{summary.memoryAddress[index]}]
                </p>
                <div>
                  <div className="row header">
                    <span>Cache</span>
                    <span>Memória</span>
                  </div>

                  <div>
                    {item.map((item, index) => {
                      return (
                        <>
                          <div
                            className={
                              status.cacheIndex === index && status.hit
                                ? "row current hit"
                                : status.cacheIndex === index
                                ? "row current"
                                : "row"
                            }
                            key={index}
                          >
                            <span className="cacheStatus">
                              {index}

                              {status.cacheIndex === index && status.hit ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19.875 6.27A2.225 2.225 0 0 1 21 8.218v7.284c0 .809-.443 1.555-1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1-2.184 0l-6.75-4.27A2.225 2.225 0 0 1 3 15.502V8.217c0-.809.443-1.554 1.158-1.947l6.75-3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033zM10 16V8m4 0v8m-4-4h4"
                                  />
                                </svg>
                              ) : status.cacheIndex === index ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <g
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                  >
                                    <path d="M19.875 6.27A2.225 2.225 0 0 1 21 8.218v7.284c0 .809-.443 1.555-1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1-2.184 0l-6.75-4.27A2.225 2.225 0 0 1 3 15.502V8.217c0-.809.443-1.554 1.158-1.947l6.75-3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
                                    <path d="M9 16V8l3 5l3-5v8" />
                                  </g>
                                </svg>
                              ) : (
                                ""
                              )}
                            </span>
                            <span>{item}</span>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default App;
