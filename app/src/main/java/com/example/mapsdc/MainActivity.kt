package com.example.mapsdc

import LoginScreen
import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.mapsdc.screens.RegisterScreen
import com.example.mapsdc.screens.maps.ListScreen
import com.example.mapsdc.ui.theme.MapsDCTheme

class MainActivity : ComponentActivity() {

    @SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            MapsDCTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) {
                    AuthApp(startDestination = "login")
                }
            }
        }
    }
}

@Composable
fun AuthApp(startDestination: String = "login") {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = startDestination) {
        composable("login") { LoginScreen(navController) }
        composable("register") { RegisterScreen(navController) }
        composable("list_screen/{userId}") { backStackEntry ->
            val userId = backStackEntry.arguments?.getString("userId")
            ListScreen(navController = navController, userId = userId ?: "")
        }
    }
}