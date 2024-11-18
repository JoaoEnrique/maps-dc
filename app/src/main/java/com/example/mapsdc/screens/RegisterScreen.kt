package com.example.mapsdc.screens

import android.widget.Toast
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.mapsdc.components.Input
import com.example.mapsdc.components.InputPassword
import com.example.mapsdc.components.Link
import com.example.mapsdc.components.PrimaryButton
import com.google.firebase.Firebase
import com.google.firebase.auth.auth

@Composable
fun RegisterScreen(navController: NavController) {
    val auth = Firebase.auth
    val context = LocalContext.current
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(30.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "Cadastro", fontSize = 30.sp)
        Spacer(modifier = Modifier.height(50.dp))

        Input(value = email, text = "Email") { email = it }

        Spacer(modifier = Modifier.height(10.dp))

        InputPassword(value = password, text = "Senha") { password = it }

        PrimaryButton(
            onClick = {
                if(email == "" || password == ""){
                    Toast.makeText(
                        context,
                        "Informe seu email e senha",
                        Toast.LENGTH_SHORT
                    ).show()
                    return@PrimaryButton;
                }
                
                auth.createUserWithEmailAndPassword(email, password)
                    .addOnCompleteListener { task ->
                        if (task.isSuccessful) {
                            Toast.makeText(
                                context,
                                "Conta criada com sucesso",
                                Toast.LENGTH_SHORT
                            ).show()
                            navController.navigate("login") {
                                popUpTo("login") {
                                    inclusive = true
                                }
                            }
                        } else {
                            Toast.makeText(
                                context,
                                "${task.exception?.message}",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    }
            },
            text = "Login"
        )

        Link("login", "Já tem uma conta? Faça login", navController)
    }
}
