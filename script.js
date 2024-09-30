function calcular() {
    const nomeCarro = document.getElementById('nomeCarro').value;
    const modelo = document.getElementById('modelo').value;
    const marca = document.getElementById('marca').value;
    const kmCidade = parseInt(document.getElementById('kmCidade').value);
    const kmEstrada = parseInt(document.getElementById('kmEstrada').value);
    const tamanhoTanque = parseInt(document.getElementById('tamanhoTanque').value);
    const distanciaTotal = parseInt(document.getElementById('distanciaTotal').value);
   // const distanciaCidade = parseInt(document.getElementById('distanciaCidade').value);
    //const distanciaEstrada = parseInt(document.getElementById('distanciaEstrada').value);

    const precoGasolina = parseFloat(document.getElementById('precoGasolina').value);
    const precoAlcool = parseFloat(document.getElementById('precoAlcool').value);
    const precoDiesel = parseFloat(document.getElementById('precoDiesel').value);
    event.preventDefault();

    const carroKey = `${nomeCarro}-${modelo}-${marca}`;
    let carroData = localStorage.getItem(carroKey);
    
    if (!carroData) {
        carroData = {
            nomeCarro,
            modelo,
            marca,
            kmCidade,
            kmEstrada,
            tamanhoTanque
        };
        localStorage.setItem(carroKey, JSON.stringify(carroData));
    } else {
        carroData = JSON.parse(carroData);
        // Atualiza os dados de distância e preços
        carroData.distanciaTotal = distanciaTotal;
    //    carroData.distanciaEstrada = distanciaEstrada;
        carroData.precoGasolina = precoGasolina;
        carroData.precoAlcool = precoAlcool;
        carroData.precoDiesel = precoDiesel;
    }

    //preço combustível por litro
    const combustiveis = [];
    if (document.getElementById('gasolina').checked) combustiveis.push({ tipo: 'Gasolina', preco: carroData.precoGasolina, eficienciaCidadeGasolina: carroData.kmCidade / carroData.precoGasolina, eficienciaEstrada: carroData.kmEstrada / carroData.precoGasolina });
    if (document.getElementById('alcool').checked) combustiveis.push({ tipo: 'Álcool', preco: carroData.precoAlcool, eficienciaCidadeAlcool: carroData.kmCidade / carroData.precoAlcool, eficienciaEstrada: carroData.kmEstrada / carroData.precoAlcool });
    if (document.getElementById('diesel').checked) combustiveis.push({ tipo: 'Diesel', preco: carroData.precoDiesel, eficienciaCidadeDiesel: carroData.kmCidade / carroData.precoDiesel, eficienciaEstrada: carroData.kmEstrada / carroData.precoDiesel });
    eficienciaCidadeDiesel = carroData.kmCidade / carroData.precoDiesel;
    console.log(eficienciaCidadeDiesel);
    eficienciaEstradaDiesel = carroData.kmEstrada / carroData.precoDiesel;
    eficienciaCidadeAlcool = carroData.kmCidade / carroData.precoAlcool;
    console.log(eficienciaCidadeAlcool);
    eficienciaEstradaAlcool = carroData.kmEstrada / carroData.precoAlcool;
    eficienciaCidadeGasolina = carroData.precoGasolina / carroData.kmCidade;
    console.log(eficienciaCidadeGasolina);
    eficienciaEstradaGasolina = carroData.precoGasolina / carroData.kmEstrada;

    //Calculo preço do combustível por km
    let resultado = '';
    combustiveis.forEach(combustivel => {
        const consumoCidade = (carroData.distanciaTotal / carroData.kmCidade).toFixed(2); // em litros
        const consumoEstrada = (carroData.distanciaTotal / carroData.kmEstrada).toFixed(2); // em litros
        //const consumoTotal = (parseFloat(consumoCidade) + parseFloat(consumoEstrada)).toFixed(2); // em litros
        const custo1 = (consumoCidade * combustivel.preco).toFixed(2);
        const custo2 = (consumoEstrada * combustivel.preco).toFixed(2); // em R$

        resultado += `Para o carro ${nomeCarro} (${modelo}, ${marca}):<br>
        Distância: ${carroData.distanciaTotal} Km<br>
        Consumo na Cidade na Gasolina (${combustivel.tipo}): ${consumoEstrada} L<br>
        Combustível na Cidade na Gasolina: ${distanciaTotal / eficienciaCidadeGasolina} L<br>
        Custo: R$ ${custo1}<br>
        Consumo na Estrada na Gasolina (${combustivel.tipo}): ${consumoCidade} L<br>
        Combustível na Estrada na Gasolina: ${distanciaTotal / eficienciaEstradaGasolina} L<br>
        Custo: R$ ${custo2}<br>`;
    });

    console.log('Setting innerHTML of #resultado to:', resultado);
    document.getElementById('resultado').innerHTML = resultado;
}
