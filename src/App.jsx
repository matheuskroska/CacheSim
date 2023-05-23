/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useReducer } from "react";
import "./App.css";

function App() {
  const SET_CACHE_SIZE = "SET_CACHE_SIZE";
  const ADD_MEMORY_ADDRESS = "ADD_MEMORY_ADDRESS";
  const CLEAR_FORM = "CLEAR_FORM";
  const CLEAR_MEMORY_ADDRESSES = "CLEAR_MEMORY_ADDRESSES";

  const [step, setStep] = useState([]);
  const [stepStatus, setStepStatus] = useState([]);
  const [summary, setSummary] = useState([]);
  const [mappingType, setMappingType] = useState("direct");

  const initialState = {
    memoryAddresses: [],
    cacheSize: "",
  };

  const formReducer = (state, action) => {
    switch (action.type) {
      case SET_CACHE_SIZE:
        return { ...state, cacheSize: action.payload };
      case ADD_MEMORY_ADDRESS:
        return {
          ...state,
          memoryAddresses: [...state.memoryAddresses, action.payload],
        };
      case CLEAR_FORM:
        return initialState;
      case CLEAR_MEMORY_ADDRESSES:
        return {
          ...state,
          memoryAddresses: [],
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(formReducer, initialState);

  const directMappingCache = (memoryAddress, cacheSize) => {
    // Converte os endereços de memória para números inteiros
    memoryAddress = memoryAddress.map((item) => parseInt(item));
    // Converte o tamanho do cache para um número inteiro
    cacheSize = parseInt(cacheSize);

    // Cria um array de cache preenchido com -1, indicando que está vazio
    const cache = Array(cacheSize).fill(-1);
    // Cria um array para armazenar cada etapa do cache
    const cacheStep = [];
    // Cria um array para armazenar o status de cada etapa do cache (acerto ou erro)
    const cacheStepStatus = [];
    // Inicializa as variáveis de contagem de acertos e erros
    let hit = 0;
    let miss = 0;

    // Percorre cada endereço de memória
    for (let i = 0; i < memoryAddress.length; i++) {
      // Calcula o índice do cache para o endereço de memória atual
      const cacheIndex = memoryAddress[i] % cacheSize;
      // Verifica se o valor do cache no índice calculado é igual ao endereço de memória atual
      const hitValue = cache[cacheIndex] === memoryAddress[i];
      // Cria um objeto para armazenar o valor do endereço de memória, o índice do cache e se houve acerto
      const access = {
        value: memoryAddress[i],
        cacheIndex: cacheIndex,
        hit: hitValue,
      };

      // Se houver acerto, incrementa o contador de acertos
      if (hitValue) {
        hit++;
      } else {
        // Se houver erro, atualiza o valor do cache no índice calculado com o novo endereço de memória
        cache[cacheIndex] = memoryAddress[i];
        // Incrementa o contador de erros
        miss++;
      }

      // Adiciona o estado atual do cache ao array de etapas
      cacheStep.push([...cache]);
      // Adiciona o status do acesso atual (acerto ou erro) ao array de status das etapas
      cacheStepStatus.push(access);
    }

    // definindo as variáveis `setStep` e `setStepStatus` com os arrays de etapas e status do cache, respectivamente.
    setStep(cacheStep);
    setStepStatus(cacheStepStatus);

    // Retorna um objeto com o total de acertos, erros, taxa de acertos e os endereços de memória
    return {
      hit,
      miss,
      hitRate: (hit / (hit + miss)).toFixed(2),
      memoryAddress,
    };
  };


  const handleDirectMappingCache = (event) => {
    const sumary = directMappingCache(
      memObj[event.target.value].data,
      memObj[event.target.value].cacheSize
    );

    setSummary(sumary);
  };

  const handleAssocMappingCache = (event) => {
    console.log(event.target.value);
  };

  const setCacheSize = (cacheSize) => ({
    type: SET_CACHE_SIZE,
    payload: cacheSize,
  });

  const clearForm = () => ({
    type: CLEAR_FORM,
  });

  const clearMemoryAddresses = () => ({
    type: "CLEAR_MEMORY_ADDRESSES",
  });

  const addMemoryAddress = (memoryAddress) => ({
    type: ADD_MEMORY_ADDRESS,
    payload: memoryAddress,
  });

  const handleMemAdress = (event) => {
    event.preventDefault();
    const memoryAddress = document.getElementById("mem").value;
    if (memoryAddress !== "") {
      dispatch(addMemoryAddress(parseInt(memoryAddress)));
    }
    document.getElementById("mem").value = "";
  };

  const handleClearForm = (e) => {
    e.preventDefault();
    dispatch(clearForm());
    dispatch(setCacheSize(""));
    dispatch(clearMemoryAddresses());

    const sumary = directMappingCache(memObj[0].data, memObj[0].cacheSize);
    setSummary(sumary);
  };

  const handleCacheSize = (event) => {
    event.preventDefault();
    const cacheSize = document.getElementById("cacheSize").value;
    if (cacheSize !== "") {
      dispatch(setCacheSize(cacheSize));
    }
    document.getElementById("cacheSize").value = "";
  };

  const handleCalculate = (event) => {
    event.preventDefault();
    const sumary = directMappingCache(state.memoryAddresses, state.cacheSize);
    setSummary(sumary);
  };

  const handleTypeMapping = (event) => {
    setMappingType(event.target.value);
  };

  const memObj = [
    { data: [0, 1, 2, 3, 1, 4, 5, 6], cacheSize: 5 },
    { data: [0, 1, 2, 2, 22, 32, 42, 20, 1, 10, 11, 12, 13], cacheSize: 10 },
    { data: [1, 6, 1, 11, 1, 16, 1, 21, 1, 26], cacheSize: 8 },
    { data: [33, 3, 11, 5], cacheSize: 5 },
  ];

  const memObjAssoc = [
    {
      data: [0, 1, 2, 3, 1, 4, 5, 6],
      cacheSize: 5,
      associativity: 1,
      set: 5,
      replacementPolicy: "LRU",
    },
    {
      data: [0, 1, 2, 2, 22, 32, 42, 20, 1, 10, 11, 12, 13],
      cacheSize: 10,
      associativity: 2,
      set: 5,
      replacementPolicy: "LFU",
    },
    {
      data: [1, 6, 1, 11, 1, 16, 1, 21, 1, 26],
      cacheSize: 8,
      associativity: 4,
      set: 2,
      replacementPolicy: "FIFO",
    },
    {
      data: [33, 3, 11, 5],
      cacheSize: 5,
      associativity: 1,
      set: 5,
      replacementPolicy: "RANDOM",
    },
  ];

  useEffect(() => {
    const sumary = directMappingCache(memObj[0].data, memObj[0].cacheSize);
    setSummary(sumary);
  }, []);

  return (
    <>
      <div className="stepTitle">
        <h1>Cache Sim</h1>
        <h2>
          <select onChange={handleTypeMapping}>
            <option value="direct">Mapeamento Direto</option>
            <option value="assoc">Mapeamento Associativo</option>
          </select>
        </h2>
        {mappingType == "assoc" ? (
          <>
            <select onChange={handleAssocMappingCache}>
              {memObjAssoc.map((item, index) => {
                return (
                  <option key={index} value={index}>
                    Endereços da memória = {item.data.toString()}; Tamanho da
                    cache = {item.cacheSize}; Associatividade ={" "}
                    {item.associativity}; Conjuntos = {item.set}; Política de
                    substituição = {item.replacementPolicy}
                  </option>
                );
              })}
            </select>
          </>
        ) : (
          <>
            <select onChange={handleDirectMappingCache}>
              {memObj.map((item, index) => {
                return (
                  <option key={index} value={index}>
                    Endereços da memória = {item.data.toString()}, Tamanho da
                    cache = {item.cacheSize}
                  </option>
                );
              })}
            </select>

            <form className="form">
              <div className="inputField">
                <input
                  id="mem"
                  type="number"
                  placeholder="Endereço da memória"
                  min="0"
                  max="999999"
                />
                <button onClick={handleMemAdress}>+</button>
              </div>
              <div className="inputField">
                <input
                  id="cacheSize"
                  type="number"
                  placeholder="Tamanho da cache"
                  min="0"
                  max="999999"
                />
                <button onClick={handleCacheSize}>+</button>
              </div>
              <div className="actionButtons">
                <button onClick={handleClearForm}>Limpar</button>
                <button onClick={handleCalculate}>Calcular</button>
              </div>

              {state.memoryAddresses.length > 0 && (
                <div className="inputValues">
                  <div className="memoryAdresses">
                    {state.memoryAddresses.length > 0 && (
                      <p>Endereços da memória:</p>
                    )}
                    <ul>
                      {[
                        state.memoryAddresses.map((memoryAddress, index) => (
                          <li key={index}>
                            {memoryAddress}
                            {index !== state.memoryAddresses.length - 1 && ", "}
                          </li>
                        )),
                      ]}
                    </ul>
                  </div>
                  {state.cacheSize.length > 0 && (
                    <div className="cacheSize">
                      {state.cacheSize !== "" && (
                        <>
                          <p>Tamanho da cache:</p>
                          <span> {state.cacheSize}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </form>

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
          </>
        )}
      </div>

      {mappingType === "assoc" ? (
        <></>
      ) : (
        <div className="stepContainer">
          {step &&
            step.map((item, index) => {
              const status = stepStatus[index];
              return (
                <div className="stepCard" key={index}>
                  <p className="stepIndex">
                    Passo {index + 1} - Endereço [{summary.memoryAddress[index]}
                    ]
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
      )}
    </>
  );
}

export default App;
