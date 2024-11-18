import android.content.ContentValues.TAG
import android.content.Context
import android.content.Context.MODE_PRIVATE
import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.background
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.mapsdc.components.Input
import com.example.mapsdc.components.InputPassword
import com.example.mapsdc.components.Link
import com.example.mapsdc.components.PrimaryButton
import com.example.mapsdc.utils.getUserIdFromSession
import com.example.mapsdc.utils.saveUserIdToSession
import com.google.firebase.Firebase
import com.google.firebase.auth.auth

@Composable
fun LoginScreen(navController: NavController) {
    val auth = Firebase.auth
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val context = LocalContext.current

    val userId = getUserIdFromSession(context)

    if(userId != null){
        navController.navigate("list_screen/$userId")
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(30.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "Login", fontSize = 30.sp)
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

                auth.signInWithEmailAndPassword(email, password)
                    .addOnCompleteListener { task ->
                        if (task.isSuccessful) {
                            val userId = task.result?.user?.uid ?: ""
                            Toast.makeText(context, "Login bem-sucedido", Toast.LENGTH_SHORT).show()

                            // Salva o ID do usuário na sessão
                            saveUserIdToSession(context, userId)

                            navController.navigate("list_screen/$userId") // Redireciona para ListScreen
                        } else {
                            Toast.makeText(context, "Falha no login: ${task.exception?.message}", Toast.LENGTH_SHORT).show()
                        }
                    }
            },
            "Login"
        )


        Link("register", "Não tem conta? Cadastre-se", navController)
    }
}
