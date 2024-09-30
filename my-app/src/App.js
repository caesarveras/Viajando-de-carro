import React, { useState } from 'react';

function App() {
  const [step, setStep] = useState(1);
  const [carro, setCarro] = useState({
    nome: '',
    modelo: '',
    marca: '',
    tamanhoTanque: '',
    aceitaGasolina: false,
    aceitaAlcool: false,
    aceitaDiesel: false,
    kmCidadeGasolina: '',
    kmEstradaGasolina: '',
    kmCidadeAlcool: '',
    kmEstradaAlcool: '',
    kmCidadeDiesel: '',
    kmEstradaDiesel: '',
    distanciaTotal: '',
    precoGasolina: '',
    precoAlcool: '',
    precoDiesel: '',
  });

  const [resultado, setResultado] = useState('');
  const [error, setError] = useState('');
  const [quilometragem30, setQuilometragem30] = useState('');

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const valor = type === 'checkbox' ? checked : value;
    setCarro((prevCarro) => ({ ...prevCarro, [id]: valor }));
  };

  const validarPasso1 = () => {
    const { nome, modelo, marca, tamanhoTanque, aceitaGasolina, aceitaAlcool, aceitaDiesel } = carro;
    if (!nome || !modelo || !marca || !tamanhoTanque || (!aceitaGasolina && !aceitaAlcool && !aceitaDiesel)) {
      setError('Todos os campos são obrigatórios e ao menos um tipo de combustível deve ser selecionado.');
      return false;
    }
    setError('');
    return true;
  };

  const validarPasso2 = () => {
    const {
      aceitaGasolina, kmCidadeGasolina, kmEstradaGasolina,
      aceitaAlcool, kmCidadeAlcool, kmEstradaAlcool,
      aceitaDiesel, kmCidadeDiesel, kmEstradaDiesel
    } = carro;

    if (aceitaGasolina && (!kmCidadeGasolina || !kmEstradaGasolina)) {
      setError('Preencha os campos de consumo de gasolina.');
      return false;
    }
    if (aceitaAlcool && (!kmCidadeAlcool || !kmEstradaAlcool)) {
      setError('Preencha os campos de consumo de álcool.');
      return false;
    }
    if (aceitaDiesel && (!kmCidadeDiesel || !kmEstradaDiesel)) {
      setError('Preencha os campos de consumo de diesel.');
      return false;
    }
    setError('');
    return true;
  };

  const validarPasso3 = () => {
    const { distanciaTotal, precoGasolina, precoAlcool, precoDiesel } = carro;
    if (!distanciaTotal || (!precoGasolina && !precoAlcool && !precoDiesel)) {
      setError('Preencha todos os campos de distância e preço de combustível.');
      return false;
    }
    setError('');
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validarPasso1()) return;
    if (step === 2 && !validarPasso2()) return;
    if (step === 3 && !validarPasso3()) return;
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const calcular = (e) => {
    e.preventDefault();

    const {
      nome, modelo, marca, kmCidadeGasolina, kmEstradaGasolina,
      kmCidadeAlcool, kmEstradaAlcool, kmCidadeDiesel, kmEstradaDiesel,
      distanciaTotal, precoGasolina, precoAlcool, precoDiesel, tamanhoTanque
    } = carro;

    const combustiveis = [];

    if (carro.aceitaGasolina) {
      combustiveis.push({
        tipo: 'Gasolina',
        preco: precoGasolina,
        eficienciaCidade: kmCidadeGasolina,
        eficienciaEstrada: kmEstradaGasolina,
      });
    }

    if (carro.aceitaAlcool) {
      combustiveis.push({
        tipo: 'Álcool',
        preco: precoAlcool,
        eficienciaCidade: kmCidadeAlcool,
        eficienciaEstrada: kmEstradaAlcool,
      });
    }

    if (carro.aceitaDiesel) {
      combustiveis.push({
        tipo: 'Diesel',
        preco: precoDiesel,
        eficienciaCidade: kmCidadeDiesel,
        eficienciaEstrada: kmEstradaDiesel,
      });
    }

    let resultadoFinal = '';
    let quilometragem30 = '';

    combustiveis.forEach((combustivel) => {
      const consumoCidade = (distanciaTotal / combustivel.eficienciaCidade).toFixed(2);
      const consumoEstrada = (distanciaTotal / combustivel.eficienciaEstrada).toFixed(2);
      const consumoTotal = Math.max(consumoCidade, consumoEstrada);
      const custoCidade = (consumoCidade * combustivel.preco).toFixed(2);
      const custoEstrada = (consumoEstrada * combustivel.preco).toFixed(2);

      resultadoFinal += `Para o carro ${nome} (${modelo}, ${marca}) na distância de ${distanciaTotal}Km:\n`;
      resultadoFinal += `Consumo na Cidade com ${combustivel.tipo}: ${consumoCidade} L\n`;
      resultadoFinal += `Custo na Cidade: R$ ${custoCidade}\n`;
      resultadoFinal += `Consumo na Estrada com ${combustivel.tipo}: ${consumoEstrada} L\n`;
      resultadoFinal += `Custo na Estrada: R$ ${custoEstrada}\n\n`;

      // Verificar se a viagem excede a capacidade do tanque
      if (consumoTotal > tamanhoTanque) {
        // Cálculo da quilometragem quando o tanque atingir 30%
        const combustivelRestante = tamanhoTanque * 0.3; // 30% do tanque
        const quilometragem30Cidade = (combustivelRestante * combustivel.eficienciaCidade).toFixed(2);
        const quilometragem30Estrada = (combustivelRestante * combustivel.eficienciaEstrada).toFixed(2);

        quilometragem30 += `Aviso: Para o combustível ${combustivel.tipo}, você atingirá 30% do tanque após aproximadamente:\n`;
        quilometragem30 += `Na Cidade: ${quilometragem30Cidade} Km\n`;
        quilometragem30 += `Na Estrada: ${quilometragem30Estrada} Km\n\n`;
      }
    });

    setResultado(resultadoFinal);
    setQuilometragem30(quilometragem30);
    setStep(4); // Exibe o resultado na etapa 4
  };

  return (
    <div>
      <h1>Viajando de Carro</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {step === 1 && (
        <div>
          <h2>Passo 1: Informações do Carro</h2>
          <label>
            Nome do Carro:
            <input type="text" id="nome" value={carro.nome} onChange={handleChange} required />
          </label>

          <label>
            Modelo:
            <input type="text" id="modelo" value={carro.modelo} onChange={handleChange} required />
          </label>

          <label>
            Marca:
            <input type="text" id="marca" value={carro.marca} onChange={handleChange} required />
          </label>

          <label>
            Tamanho do Tanque (L):
            <input type="number" id="tamanhoTanque" value={carro.tamanhoTanque} onChange={handleChange} required />
          </label>

          <label>
            Tipos de Combustível Aceitos:
            <input type="checkbox" id="aceitaGasolina" checked={carro.aceitaGasolina} onChange={handleChange} /> Gasolina
            <input type="checkbox" id="aceitaAlcool" checked={carro.aceitaAlcool} onChange={handleChange} /> Álcool
            <input type="checkbox" id="aceitaDiesel" checked={carro.aceitaDiesel} onChange={handleChange} /> Diesel
          </label>

          <button onClick={nextStep}>Avançar</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Passo 2: Consumo do Carro</h2>
          {carro.aceitaGasolina && (
            <>
              <label>
                Km/L na Cidade com Gasolina:
                <input type="number" id="kmCidadeGasolina" value={carro.kmCidadeGasolina} onChange={handleChange} required />
              </label>

              <label>
                Km/L na Estrada com Gasolina:
                <input type="number" id="kmEstradaGasolina" value={carro.kmEstradaGasolina} onChange={handleChange} required />
              </label>
            </>
          )}

          {carro.aceitaAlcool && (
            <>
              <label>
                Km/L na Cidade com Álcool:
                <input type="number" id="kmCidadeAlcool" value={carro.kmCidadeAlcool} onChange={handleChange} required />
              </label>

              <label>
                Km/L na Estrada com Álcool:
                <input type="number" id="kmEstradaAlcool" value={carro.kmEstradaAlcool} onChange={handleChange} required />
              </label>
            </>
          )}

          {carro.aceitaDiesel && (
            <>
              <label>
                Km/L na Cidade com Diesel:
                <input type="number" id="kmCidadeDiesel" value={carro.kmCidadeDiesel} onChange={handleChange} required />
              </label>

              <label>
                Km/L na Estrada com Diesel:
                <input type="number" id="kmEstradaDiesel" value={carro.kmEstradaDiesel} onChange={handleChange} required />
              </label>
            </>
          )}

          <button onClick={prevStep}>Voltar</button>
          <button onClick={nextStep}>Avançar</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Passo 3: Distância Total e posto de combustível:</h2>
          <label>
            Distância Total a Percorrer (Km):
            <input type="number" id="distanciaTotal" value={carro.distanciaTotal} onChange={handleChange} required />
          </label>

          <label>
            Preço da Gasolina (R$):
            <input type="number" id="precoGasolina" value={carro.precoGasolina} onChange={handleChange} required />
          </label>

          <label>
            Preço do Álcool (R$):
            <input type="number" id="precoAlcool" value={carro.precoAlcool} onChange={handleChange} required />
          </label>

          <label>
            Preço do Diesel (R$):
            <input type="number" id="precoDiesel" value={carro.precoDiesel} onChange={handleChange} required />
          </label>

          <button onClick={prevStep}>Voltar</button>
          <button onClick={calcular}>Calcular</button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2>Resultado</h2>
          <pre>{resultado}</pre>
          {quilometragem30 && (
            <div>
              <h3>Aviso de Combustível</h3>
              <pre>{quilometragem30}</pre>
            </div>
          )}
          <button onClick={() => setStep(1)}>Reiniciar</button>
        </div>
      )}
    </div>
  );
}

export default App;
