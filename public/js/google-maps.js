var origemAutocomplete;
var destinoAutocomplete;
var origemMarker = null;
var destinoMarker = null;
var geocoder = new google.maps.Geocoder();


var map = new google.maps.Map(document.getElementById("map"), {
  center: { lat: -23.5505, lng: -46.6333 },
  zoom: 12,
});

var directionsRenderer = new google.maps.DirectionsRenderer({
  map: map,
});

function formatarFloat(numero) {
  numero = numero.replace('.', '')
  numero = numero.replace(',', '.')

  return numero;
}

//  caso o orçamento já exista, pega os valores
function calcularCombustivel() {
  var travelMode = document.getElementById("locomocao").value;
  var origem = document.getElementById("origem").value;
  var destino = document.getElementById("destino").value;
  let consumo_combustivel = isNaN(parseFloat($("#consumo_combustivel").val())) ? 0 : parseFloat(formatarFloat($("#consumo_combustivel").val()));
  let preco_combustivel = isNaN(parseFloat($("#preco_combustivel").val())) ? 0 : parseFloat(formatarFloat($("#preco_combustivel").val()));

  if (origem != "" && destino != "" && consumo_combustivel != "" && preco_combustivel != "") {
      var directionsService = new google.maps.DirectionsService();
      var request = {
          origin: origem,
          destination: destino,
          travelMode: travelMode,
      };

      directionsService.route(request, function (result, status) {
          if (status == "OK") {
              directionsRenderer.setDirections(result);

              var distancia = result.routes[0].legs[0].distance.value / 1000; // distância em km
              var distanciaIdaVolta = distancia * 2; // calcular ida e volta
              var consumoCombustivel = distancia / consumo_combustivel; // calcular consumo
              var valorCombustivel = consumoCombustivel * preco_combustivel; // custo total
              var valorCombustivelIdaVolta = valorCombustivel * 2; // custo ida e volta
              var duracao = result.routes[0].legs[0].duration.value / 60; // duração em minutos

              // Certifique-se de que está chamando a função correta para exibir os resultados
              mostrarPrecoCombustivel(distancia, distanciaIdaVolta, consumoCombustivel, valorCombustivelIdaVolta, valorCombustivel, travelMode, duracao);
          } else {
              console.error("Não foi possível calcular a rota.");
          }
      });
  }
}

calcularCombustivel();


function initAutocomplete() {
  // Autocomplete para o campo de origem
  origemAutocomplete = new google.maps.places.Autocomplete(
    document.getElementById("origem")
  );
  origemAutocomplete.bindTo("bounds", map);

  origemAutocomplete.addListener("place_changed", function () {
    var place = origemAutocomplete.getPlace();
    if (!place.geometry) {
      alert("Não foi possível obter a localização para a origem.");
      return;
    }

    if (origemMarker) {
      origemMarker.setMap(null);
    }

    origemMarker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
    });
    map.setCenter(place.geometry.location);
    map.setZoom(12);
  });

  // Autocomplete para o campo de destino
  destinoAutocomplete = new google.maps.places.Autocomplete(
    document.getElementById("destino")
  );
  destinoAutocomplete.bindTo("bounds", map);

  destinoAutocomplete.addListener("place_changed", function () {
    var place = destinoAutocomplete.getPlace();
    if (!place.geometry) {
      alert("Não foi possível obter a localização para o destino.");
      return;
    }

    if (destinoMarker) {
      destinoMarker.setMap(null);
    }

    destinoMarker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
    });
    map.setCenter(place.geometry.location);
    map.setZoom(12);
  });
}

map.addListener("click", function (event) {
  if (origemMarker == null) {
    // Criar o marcador de origem
    origemMarker = new google.maps.Marker({
      position: event.latLng,
      map: map,
    });

    // Usar Geocoding para obter o endereço
    geocoder.geocode({ location: event.latLng }, function (results, status) {
      if (status === "OK") {
        if (results[0]) {
          document.getElementById("origem").value = results[0].formatted_address; // Usar o endereço formatado
        } else {
          alert("Nenhum resultado encontrado");
        }
      } else {
        alert("Geocoder falhou devido ao seguinte: " + status);
      }
    });
  } else if (destinoMarker == null) {
    // Criar o marcador de destino
    destinoMarker = new google.maps.Marker({
      position: event.latLng,
      map: map,
    });

    // Usar Geocoding para obter o endereço
    geocoder.geocode({ location: event.latLng }, function (results, status) {
      if (status === "OK") {
        if (results[0]) {
          document.getElementById("destino").value = results[0].formatted_address; // Usar o endereço formatado
        } else {
          alert("Nenhum resultado encontrado");
        }
      } else {
        alert("Geocoder falhou devido ao seguinte: " + status);
      }
    });

    // Calcular a rota
    var travelMode = document.getElementById("locomocao").value;
    var directionsService = new google.maps.DirectionsService();
    var request = {
      origin: document.getElementById("origem").value,
      destination: document.getElementById("destino").value,
      travelMode: travelMode,
    };

    directionsService.route(request, function (result, status) {
      if (status == "OK") {
        $(".btn-calcular").css('display', 'block');
        directionsRenderer.setDirections(result);
      } else {
        // alert("Não foi possível calcular a rota.");
      }
    });
  } else {
    // Se ambos os marcadores já estiverem definidos, redefinir
    origemMarker.setMap(null);
    destinoMarker.setMap(null);
    origemMarker = new google.maps.Marker({
      position: event.latLng,
      map: map,
    });
    destinoMarker = null;
    // Repetir o processo de geocoding para a nova origem
    geocoder.geocode({ location: event.latLng }, function (results, status) {
      if (status === "OK") {
        if (results[0]) {
          document.getElementById("origem").value = results[0].formatted_address;
        } else {
          alert("Nenhum resultado encontrado");
        }
      } else {
        alert("Geocoder falhou devido ao seguinte: " + status);
      }
    });
    document.getElementById("destino").value = "";
    directionsRenderer.set("directions", null);
  }
});

function calcularDeslocamento(e) {
  e.preventDefault();
  calcularCombustivel()
}

function formatarComoMoeada(numero) {
    numero = numero.replace(',', '')
    numero = numero.replace('.', ',')

    return numero;
}

function mostrarPrecoCombustivel(distancia, distanciaIdaVolta, consumoCombustivel, valorCombustivelIdaVolta, valorCombustivel, travelMode, duracao){
    document.getElementById("resultado").innerHTML = `
            <p>Distância:  <b>${formatarComoMoeada(distancia.toFixed(2))} KM</b></p>
            <p>Distância (Ida e Volta):  <b>${formatarComoMoeada(distanciaIdaVolta.toFixed(2))} KM</b></p>
            <p>Tempo estimado: <b>${Math.floor(duracao)} minutos</b></p> <!-- Exibe o tempo estimado de viagem -->
        `

      if(travelMode == "DRIVING"){
        document.getElementById("resultado").innerHTML += `
            <p>Consumo:  <b>${formatarComoMoeada(consumoCombustivel.toFixed(2))} litros</b></p>
            <p>Valor: <b>R$ ${formatarComoMoeada(valorCombustivel.toFixed(2))}</b></p>
            <p>Valor (ida e volta): <b>R$ ${formatarComoMoeada(valorCombustivelIdaVolta.toFixed(2))}</b></p>
        `
      }

    $("#duracao").val(duracao);
    $("#distancia").val(distancia);
    $("#distancia_ida_volta").val(distanciaIdaVolta);

    $("#consumo").val(consumoCombustivel);
    $("#valor").val(valorCombustivel);
    $("#valor_ida_volta").val(valorCombustivelIdaVolta);

    $(".btn-fechar-deslocamento").css('display', 'none')
    if($("#is_edit").val() == 0) $(".btn-salvar").css('display', 'block')
}

if(document.querySelector('#calculationForm')) document.querySelector('#calculationForm').addEventListener('submit', calcularDeslocamento);

document.querySelectorAll('.verificar-valor-deslocamento').forEach(e=>{//mostra botão de salvar ao editar campo
  e.addEventListener('keyup', verificarValorDeslocamento); 
})
function verificarValorDeslocamento(){
  $(".btn-calcular").css('display', 'block')
  $(".btn-fechar-deslocamento").css('display', 'block')
  if(!$("#is_edit").val()) $(".btn-salvar").css('display', 'none')
}

initAutocomplete();