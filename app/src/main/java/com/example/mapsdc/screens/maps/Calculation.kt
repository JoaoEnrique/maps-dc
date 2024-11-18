package com.example.mapsdc.screens.maps

data class Calculation(
    val id: String,
    val origem: String,
    val destino: String,
    val distancia: Double,
    val preco_combustivel: Double,
    val consumo: Double,
    val valor: Double,
    val locomocao: String,
    val duracao: Double
)