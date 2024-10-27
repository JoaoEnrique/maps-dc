var origemAutocomplete;
var destinoAutocomplete;
var origemMarker = null;
var destinoMarker = null;

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
function calcularCombustivel(){
  var travelMode = document.getElementById("locomocao").value;
  var origem = document.getElementById("origem").value;
  var destino = document.getElementById("destino").value;
  let consumo_combustivel = isNaN(parseFloat($("#consumo_combustivel").val())) ? 0 : parseFloat(formatarFloat($("#consumo_combustivel").val()))
  let preco_combustivel = isNaN(parseFloat($("#preco_combustivel").val())) ? 0 : parseFloat(formatarFloat($("#preco_combustivel").val()))

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

              var distancia = result.routes[0].legs[0].distance.value / 1000;
              var distanciaIdaVolta = distancia * 2;
              var consumoCombustivel = distancia / consumo_combustivel;
              var valorCombustivel = consumoCombustivel * preco_combustivel;
              var valorCombustivelIdaVolta = valorCombustivel * 2;

              mostrarPrecoCombustivel(distancia, distanciaIdaVolta, consumoCombustivel, valorCombustivelIdaVolta, valorCombustivel, travelMode)

          } else {
              console.error("Não foi possível calcular a rota.");
          }
      });
  }
}
calcularCombustivel()


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
    origemMarker = new google.maps.Marker({
      position: event.latLng,
      map: map,
    });
    document.getElementById("origem").value =
      event.latLng.lat() + ", " + event.latLng.lng();
  } else if (destinoMarker == null) {
    destinoMarker = new google.maps.Marker({
      position: event.latLng,
      map: map,
    });
    var travelMode = document.getElementById("locomocao").value;
    document.getElementById("destino").value =
      event.latLng.lat() + ", " + event.latLng.lng();
    var directionsService = new google.maps.DirectionsService();
    var request = {
      origin: document.getElementById("origem").value,
      destination: document.getElementById("destino").value,
      travelMode: travelMode,
    };

    directionsService.route(request, function (result, status) {
      if (status == "OK") {
        $(".btn-calcular").css('display', 'block')
        directionsRenderer.setDirections(result);
      } else {
        alert("Não foi possível calcular a rota.");
      }
    });
  } else {
    origemMarker.setMap(null);
    destinoMarker.setMap(null);
    origemMarker = new google.maps.Marker({
      position: event.latLng,
      map: map,
    });
    destinoMarker = null;
    document.getElementById("origem").value =
      event.latLng.lat() + ", " + event.latLng.lng();
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

function mostrarPrecoCombustivel(distancia, distanciaIdaVolta, consumoCombustivel, valorCombustivelIdaVolta, valorCombustivel, travelMode){
    document.getElementById("resultado").innerHTML = `
            <p>Distância:  <b>${formatarComoMoeada(distancia.toFixed(2))} KM</b></p>
            <p>Distância (Ida e Volta):  <b>${formatarComoMoeada(distanciaIdaVolta.toFixed(2))} KM</b></p>
        `

      if(travelMode == "DRIVING"){
        document.getElementById("resultado").innerHTML += `
            <p>Consumo:  <b>${formatarComoMoeada(consumoCombustivel.toFixed(2))} litros</b></p>
            <p>Valor: <b>R$ ${formatarComoMoeada(valorCombustivel.toFixed(2))}</b></p>
            <p>Valor (ida e volta): <b>R$ ${formatarComoMoeada(valorCombustivelIdaVolta.toFixed(2))}</b></p>
        `
      }

    $("#distancia").val(distancia);
    $("#distancia_ida_volta").val(distanciaIdaVolta);

    $("#consumo").val(consumoCombustivel);
    $("#valor").val(valorCombustivel);
    $("#valor_ida_volta").val(valorCombustivelIdaVolta);

    $(".btn-fechar-deslocamento").css('display', 'none')
    $(".btn-salvar").css('display', 'block')
}

if(document.querySelector('#calculationForm')) document.querySelector('#calculationForm').addEventListener('submit', calcularDeslocamento);

document.querySelectorAll('.verificar-valor-deslocamento').forEach(e=>{//mostra botão de salvar ao editar campo
  e.addEventListener('keyup', verificarValorDeslocamento); 
})
function verificarValorDeslocamento(){
  $(".btn-calcular").css('display', 'block')
  $(".btn-fechar-deslocamento").css('display', 'block')
  $(".btn-salvar").css('display', 'none')
}

initAutocomplete();