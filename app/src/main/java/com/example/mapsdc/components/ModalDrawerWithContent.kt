package com.example.mapsdc.components

import android.view.MenuItem
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.AppBarDefaults
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.material.IconButton
import androidx.compose.material.Surface
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddCircle
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.Button
import androidx.compose.material3.DrawerState
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.mapsdc.R
import com.example.mapsdc.ui.theme.SecondaryBlue
import com.example.mapsdc.utils.logout
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class, ExperimentalMaterialApi::class)
@Composable
fun ModalDrawerWithContent(
    mainContent: @Composable (drawerState: DrawerState) -> Unit,
    navController: NavController
) {
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    ModalNavigationDrawer( // Use ModalNavigationDrawer from Material 3
        drawerState = drawerState,
         drawerContent = {
            Column(
                modifier = Modifier
                    .background(Color.White).background(Color.White).fillMaxHeight().width(300.dp)
            ) {
                Column (
                    modifier = Modifier.background(SecondaryBlue).width(300.dp).height(250.dp),
                ){
                    Image(
                        painter = painterResource(id = R.drawable.logo),
                        contentDescription = "Logo do Maps DC",
                        contentScale = ContentScale.FillWidth,
                    )
                }

                Column(
                    modifier = Modifier.padding(0.dp, 36.dp)
                ){
                    MenuItem(
                        icon = Icons.Filled.Home,
                        label = "Sair",
                    ){
                        logout(context)
                        navController.navigate("login")
                    }
                }
            }
        },
        content = {
            Column {
                TopAppBar(
                    windowInsets = AppBarDefaults.topAppBarWindowInsets,
                    title = { Text("Maps DC") },
                    navigationIcon = {
                        IconButton(onClick = { scope.launch { drawerState.open() } }) {
                            Icon(Icons.Filled.Menu, contentDescription = null)
                        }
                    },
                    actions = {

                    }
                )

                mainContent(drawerState)
            }
        }
    )
}

@OptIn(ExperimentalMaterialApi::class)
@Composable
fun MenuItem(
    icon: ImageVector,
    label: String,
    onClick: () -> Unit

){
    Surface(
        modifier = Modifier.fillMaxWidth(),
        onClick = onClick,) {
        Row(
            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
            modifier = Modifier.padding(16.dp)
        ) {
            Icon(icon, contentDescription = null)
            Text(label, modifier = Modifier.padding(start = 16.dp))
        }
    }
}