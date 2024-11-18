package com.example.mapsdc.screens.maps

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.Button
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.Icon
import androidx.compose.material3.ListItem
import androidx.compose.material3.Text
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.mapsdc.components.ModalDrawerWithContent
import com.example.mapsdc.utils.formatNumber
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.launch

@Composable
fun ListScreen(navController: NavController, userId: String) {
    ModalDrawerWithContent(
        mainContent = { drawerState ->
            ListScreenContent(navController, userId)
        },
        navController = navController
    )
}

@Composable
fun ListScreenContent(navController: NavController, userId: String) {
    val calculations = remember { mutableStateOf<List<Calculation>>(emptyList()) }
    val firestore = FirebaseFirestore.getInstance()

    LaunchedEffect(userId) {
        firestore.collection("calculations")
            .whereEqualTo("userId", userId)
            .get()
            .addOnSuccessListener { documents ->
                val list = documents.map { document ->
                    val locomocao = when (document.getString("locomocao") ?: "") {
                        "DRIVING" -> "Carro"
                        "BICYCLING" -> "Bicicleta"
                        "TRANSIT" -> "Transporte Público"
                        "WALKING" -> "A pé"
                        else -> "--"
                    }

                    Calculation(
                        id = document.id,
                        origem = document.getString("origem") ?: "",
                        destino = document.getString("destino") ?: "",
                        distancia = document.getString("distancia")?.toDouble() ?: 0.0,
                        preco_combustivel = document.getString("preco_combustivel")?.toDouble() ?: 0.0,
                        valor = document.getString("valor")?.toDouble() ?: 0.0,
                        consumo = document.getString("consumo")?.toDouble() ?: 0.0,
                        duracao = document.getString("duracao")?.toDouble() ?: 0.0,
                        locomocao = locomocao,
                    )
                }
                calculations.value = list
            }
            .addOnFailureListener { exception ->
                Log.e("ListScreen", "Erro ao buscar cálculos", exception)
            }
    }

    Column(
        Modifier.padding(16.dp, 40.dp)
    ) {
        LazyColumn (
            Modifier.fillMaxWidth().background(Color.Gray)
        ) {
            items(calculations.value) { calculation ->

                ListItem(
                    headlineContent = {
                        Column {
                            Text(
                                text = calculation.origem,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Text(
                                text = calculation.destino,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                        }
                    },
                    supportingContent = {
                        Column(
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row (
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ){
                                Text(
                                    text = "${formatNumber(calculation.distancia, 2)} km",
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = "${formatNumber(calculation.consumo, 2)} Litros",
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = "R$ ${formatNumber(calculation.valor, 2)}",
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }

                            Row (
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ){
                                Text(
                                    text = "${calculation.locomocao}",
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = "${formatNumber(calculation.duracao, 2)} minutos",
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }
                    },
                    leadingContent = { Icon(Icons.Filled.LocationOn, contentDescription = null) },
                    modifier = Modifier.clickable {  }.background(Color.Red)
                )
            }
        }
    }
}