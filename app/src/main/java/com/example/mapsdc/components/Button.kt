package com.example.mapsdc.components

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.mapsdc.ui.theme.PrimaryBlue

@Composable
fun PrimaryButton(onClick : () -> Unit, text: String) {
    Button(
        onClick,
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 16.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = PrimaryBlue,// Define a cor de fundo do botão
            contentColor = Color.White    // Define a cor do texto dentro do botão
        ),
    ) {
        Text(text)
    }
}

@Composable
fun Link(screen: String, text: String, navController: NavController){
    TextButton(onClick = { navController.navigate(screen) }) {
        Text(text, color = PrimaryBlue)
    }
}