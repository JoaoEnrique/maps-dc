package com.example.mapsdc.utils

import android.content.Context

fun getUserIdFromSession(context: Context): String? {
    val sharedPreferences = context.getSharedPreferences("user_session", Context.MODE_PRIVATE)
    return sharedPreferences.getString("user_id", null) // Retorna o userId ou null se não encontrado
}

fun saveUserIdToSession(context: Context, userId: String) {
    val sharedPreferences = context.getSharedPreferences("user_session", Context.MODE_PRIVATE)
    val editor = sharedPreferences.edit()
    editor.putString("user_id", userId)  // Salva o userId no SharedPreferences
    editor.apply()  // Aplica as mudanças
}

fun logout(context: Context) {
    val sharedPreferences = context.getSharedPreferences("user_session", Context.MODE_PRIVATE)
    val editor = sharedPreferences.edit()
    editor.remove("user_id")  // Remove o user_id da sessão
    editor.apply()  // Aplica as mudanças, garantindo que o logout seja realizado
}


