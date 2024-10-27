var origemAutocomplete;
var destinoAutocomplete;
var origemMarker = null;
var destinoMarker = null;

function formatarFloat(numero) {
  numero = numero.replace('.', '')
  numero = numero.replace(',', '.')

  return numero;
}

//  caso o orçamento já exista, pega os valores
function calcularCombustivel(){
  var origem = document.getElementById("origem").value;
  var destino = document.getElementById("destino").value;
  let consumo_combustivel = isNaN(parseFloat($("#consumo_combustivel").val())) ? 0 : parseFloat(formatarFloat($("#consumo_combustivel").val()))
  let preco_combustivel = isNaN(parseFloat($("#preco_combustivel").val())) ? 0 : parseFloat(formatarFloat($("#preco_combustivel").val()))
  let kmAdicional = isNaN(parseFloat($("#km_adicional").val())) ? 0 : parseFloat(formatarFloat($("#km_adicional").val()))

  if (origem != "" && destino != "" && consumo_combustivel != "" && preco_combustivel != "") {
      var directionsService = new google.maps.DirectionsService();
      var request = {
          origin: origem,
          destination: destino,
          travelMode: "DRIVING",
      };

      directionsService.route(request, function (result, status) {
          if (status == "OK") {
              directionsRenderer.setDirections(result);

              var distancia = result.routes[0].legs[0].distance.value / 1000;
              var distanciaIdaVolta = distancia * 2;
              var consumoCombustivel = (distancia+kmAdicional) / consumo_combustivel;
              var valorCombustivel = consumoCombustivel * preco_combustivel;
              var valorCombustivelIdaVolta = valorCombustivel * 2;

              mostrarPrecoCombustivel(distancia, distanciaIdaVolta, kmAdicional, consumoCombustivel, valorCombustivelIdaVolta, valorCombustivel)

          } else {
              console.error("Não foi possível calcular a rota.");
          }
      });
  }
}
calcularCombustivel()


var map = new google.maps.Map(document.getElementById("map"), {
  center: { lat: -23.5505, lng: -46.6333 },
  zoom: 12,
});

var directionsRenderer = new google.maps.DirectionsRenderer({
  map: map,
});

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
    document.getElementById("destino").value =
      event.latLng.lat() + ", " + event.latLng.lng();
    var directionsService = new google.maps.DirectionsService();
    var request = {
      origin: document.getElementById("origem").value,
      destination: document.getElementById("destino").value,
      travelMode: "DRIVING",
    };

    directionsService.route(request, function (result, status) {
      if (status == "OK") {
        $(".btn-atualizar-deslocamento").css('display', 'block')
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

function calcularDeslocamento() {
    var origem = document.getElementById("origem").value;
    var destino = document.getElementById("destino").value;
    let consumo_combustivel = isNaN(parseFloat($("#consumo_combustivel").val())) ? 0 : parseFloat(formatarFloat($("#consumo_combustivel").val()))
    let preco_combustivel = isNaN(parseFloat($("#preco_combustivel").val())) ? 0 : parseFloat(formatarFloat($("#preco_combustivel").val()))
    let kmAdicional = isNaN(parseFloat($("#km_adicional").val())) ? 0 : parseFloat(formatarFloat($("#km_adicional").val()))

    if (origem == "" || destino == "" || consumo_combustivel == "" || preco_combustivel == "") {
        alert("Por favor, preencha todos os campos.");
    } else {
        var directionsService = new google.maps.DirectionsService();
        var request = {
        origin: origem,
        destination: destino,
        travelMode: "DRIVING",
        };

        directionsService.route(request, function (result, status) {
            if (status == "OK") {
                directionsRenderer.setDirections(result);

                var distancia = result.routes[0].legs[0].distance.value / 1000;
                var distanciaIdaVolta = distancia * 2;
                var consumoCombustivel = ( distancia + kmAdicional) / consumo_combustivel;
                var valorCombustivel = consumoCombustivel * preco_combustivel;
                var valorCombustivelIdaVolta = valorCombustivel * 2;
                
                mostrarPrecoCombustivel(distancia, distanciaIdaVolta, kmAdicional, consumoCombustivel, valorCombustivelIdaVolta, valorCombustivel)

                if($("#orcamento_id").val() && $("#orcamento_id").val() != 0)
                  salvarPreco()
            } else {
                alert("Não foi possível calcular a rota.");
            }
        });
    }
}

function formatarComoMoeada(numero) {
    numero = numero.replace(',', '')
    numero = numero.replace('.', ',')

    return numero;
}

function mostrarPrecoCombustivel(distancia, distanciaIdaVolta, kmAdicional, consumoCombustivel, valorCombustivelIdaVolta, valorCombustivel){
    document.getElementById("resultado").innerHTML = `
            <p>Distância:  <b>${formatarComoMoeada(distancia.toFixed(2))} KM</b></p>
            <p>Distância (Ida e Volta):  <b>${formatarComoMoeada(distanciaIdaVolta.toFixed(2))} KM</b></p>
            <p>Consumo:  <b>${formatarComoMoeada(consumoCombustivel.toFixed(2))} litros</b></p>
            <p>Valor: <b>R$ ${formatarComoMoeada(valorCombustivel.toFixed(2))}</b></p>
            <p>Valor (ida e volta): <b>R$ ${formatarComoMoeada(valorCombustivelIdaVolta.toFixed(2))}</b></p>
        `

    $("#distancia_km").val(formatarComoMoeada(distanciaIdaVolta.toFixed(2)));
    $("#valor_combustivel").val(formatarComoMoeada(valorCombustivelIdaVolta.toFixed(2)));
    $("#valor_deslocamento").val(valorCombustivelIdaVolta.toFixed(2));

    $("#valor_combustivel_orcamento").val(valorCombustivelIdaVolta.toFixed(2));
    $("#valor_deslocamento_orcamento").val(valorCombustivelIdaVolta.toFixed(2));
    $("#origem_orcamento").val($("#origem").val());
    $("#destino_orcamento").val($("#destino").val());
    $("#consumo_combustivel_orcamento").val($("#consumo_combustivel").val());
    $("#preco_combustivel_orcamento").val($("#preco_combustivel").val());

    
    $(".btn-atualizar-deslocamento").css('display', 'none')
    $(".btn-fechar-deslocamento").css('display', 'none')
    $(".btn-ok-deslocamento").css('display', 'block')
}

function salvarPreco(){
    var form = document.querySelector('#form-deslocamento-orcamento'); // Ou use o ID: document.getElementById('formId')
    // Cria um objeto FormData a partir do formulário
    var formData = new FormData(form);

    // Converte os dados do FormData em um objeto para visualização
    var dataObject = {};
    formData.forEach(function(value, key) {
        dataObject[key] = value;
    });

    // ida e volta
    dataObject['distancia_km'] = $("#distancia_km").val();

    $.ajax({
        method: "POST",
        headers: {
            'X-CSRF-TOKEN': token
        },
        url: '/orcamentoVenda/atualizar-deslocamento',
        data: dataObject,

        success: function(e){
            if(e.success == true){
                Swal.fire({
                    title: e.message,
                    // text: e.message,
                    icon: "success"
                })
                  // $("#modal-maps").modal('hide')
                  $(".btn-atualizar-deslocamento").css('display', 'none')
                  $(".btn-fechar-deslocamento").css('display', 'none')
                  $(".btn-ok-deslocamento").css('display', 'block')
            }

        },
        error: function(e){
            let errorMessage = "Ocorreu um erro ao processar sua solicitação.";
        
            // Verifica se há uma mensagem de erro detalhada
            if (e.responseJSON && e.responseJSON.message)
                errorMessage = e.responseJSON.message;
            else if (e.responseText)
                errorMessage = e.responseText;
        
            console.error(e?.responseJSON?.error ?? '');
            console.error(e);
            swal(`Erro: ${e.status}`, errorMessage, "error");
        }
    })
    
}

if(document.querySelector('.btn-atualizar-deslocamento')) document.querySelector('.btn-atualizar-deslocamento').addEventListener('click', calcularDeslocamento);

document.querySelectorAll('.verificar-valor-deslocamento').forEach(e=>{//mostra botão de salvar ao editar campo
  e.addEventListener('keyup', verificarValorDeslocamento); 
})
function verificarValorDeslocamento(){
  $(".btn-atualizar-deslocamento").css('display', 'block')
  $(".btn-fechar-deslocamento").css('display', 'block')
  $(".btn-ok-deslocamento").css('display', 'none')
}


initAutocomplete();