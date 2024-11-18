package com.example.mapsdc.utils

fun formatNumber(number: Double, decimals: Int): String {
    var factor = Math.pow(10.0, decimals.toDouble())
    val result = Math.round(number * factor) / factor
    return result.toString().replace(".", ",")
}