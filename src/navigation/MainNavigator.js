import React, { useEffect, useContext, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { TouchableOpacity, StyleSheet, Text, Image, View } from "react-native";
import Colors from "../config/global_colors";
import socket from "../services/Socket";
import logo from "../../assets/logoxti.jpg";

// Importar pantallas
import SplashScreen from "../screens/splash/SplashScreen";
import WelcomeScreen from "../screens/Auth/WelcomeScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/Auth/ForgotPasswordScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import NewsListScreen from "../screens/Noticias/NewsListScreen";
import NewsDetailScreen from "../screens/Noticias/NewsDetailScreen";
import DrawerContent from "../components/DrawerContent";
import PostsScreen from "../screens/Posts/PostsScreen";
import CreatePost from "../screens/Posts/CreatePostScreen";
import PromoCreen from "../screens/Promos/PromoScreen";
import UserProfile from "../screens/Perfil/UserProfileScreen";
import ProductListScreen from "../screens/Plans/RecargasScreen";
import DetallePlanActivo from "../screens/PlanActivo/DetallePlanScreen";
import ServicesScreen from "../screens/Services/ServicesScreen";
import DesignDetails from "../screens/Services/DetailsScreen";
import InfoDetailsScreen from "../screens/Services/InfoDetailsScreen";
import ReportScreen from "../screens/Report/ReportScreen";
import AddReportScreen from "../screens/Report/AddReportScreen";
import FormularioInvitacion from "../screens/Afiliar/AfiliarScreen";
import SolicitudServicio from "../screens/SolicitudServicio/SolicitudServicioScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function AppStack() {
  return (
    <>
    
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "#fff",
        headerShown: false,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: Colors.colorSplash,
        },
      }}
    >
      <Stack.Screen name="welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "",
          headerBackTitle: "Atrás",
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.buttonTextRegister}>Registrar</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={() => ({
          headerShown: true,
          headerTitle: "",
          headerBackTitle: "Atrás",
        })}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={() => ({
          headerShown: true,
          headerTitle: "",
          headerBackTitle: "Atrás",
          headerStyle: { backgroundColor: "#F0F0F0" },
          headerTintColor: "black",
        })}
      />
    </Stack.Navigator>
    </>
  );
}

function DrawerNavigator() {
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user && user.nombre_partido) {
      const joinGroup = () => {
        socket.emit("joinRoom", user.nombre_partido);
        console.log(
          `✅ Usuario unido al grupo ${user.nombre_partido} con socket ID: ${socket.id}`
        );
      };

      if (socket.connected) {
        joinGroup();
      }

      socket.on("connection", joinGroup);

      return () => {
        socket.emit("leaveGroup", user.nombre_partido); // Dejar el grupo si el usuario cierra sesión
        socket.off("connection", joinGroup);
      };
    }
  }, [user]);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: user?.codigo_color ? user?.codigo_color : "#F0F0F0",
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
        },
        headerTintColor: user?.codigo_color ? "#fff" : "black",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <View style={styles.bordeContainer}>
              <Image
                source={user?.logo_partido ? { uri: user.logo_partido } : logo}
                style={styles.imagen}
              />
            </View>
          ),
          headerTitleAlign: "center", // Centrar logo
        }}
      />
      
      {/* <Drawer.Screen
        name="Posts"
        component={PostsScreen}
        options={({ navigation }) => ({
          headerTitle: "Publicaciones",
          // headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("CreatePost")}
            >
              <Text style={styles.buttonText}>Conectate</Text>
            </TouchableOpacity>
          ),
        })}
      /> */}
      {/* <Drawer.Screen name="Promociones" component={PromoCreen} /> */}
    </Drawer.Navigator>
  );
}

export default function MainNavigator() {
  const { user } = useContext(AuthContext);
  const [initialRoute, setInitialRoute] = useState("Splash");

  useEffect(() => {
    setTimeout(() => {
      setInitialRoute(user ? "Drawer" : "AuthStack");
    }, 2000);
  }, [user]);

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={user?.codigo_color ? user.codigo_color : Colors.colorSplash}
        barStyle={user?.codigo_color ? "light-content" : "dark-content"} // Ajusta el color del texto del status bar
      />
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: user?.codigo_color
              ? user?.codigo_color
              : "#F0F0F0",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: user?.codigo_color ? "#fff" : "black",
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="AuthStack" component={AppStack} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
        <Stack.Screen
          name="PlansDatos"
          component={ProductListScreen}
          options={{
            headerShown: true,
            headerTitle: "Planes para ti",
            headerBackTitle: "Atrás",
          }}
        />
        <Stack.Screen
          name="DirectorioScreen"
          component={ServicesScreen}
          options={{
            headerShown: true,
            headerTitle: "Directorio de Servicios",
            headerBackTitle: "Atrás",
          }}
        />
        <Stack.Screen
          name="ServiciosUser"
          component={DesignDetails}
          options={{
            headerShown: true,
            headerTitle: "Personas de servicios",
            headerBackTitle: "Atrás",
          }}
        />
        <Stack.Screen
          name="ReportUser"
          component={ReportScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: "Reporte ciudadano",
            headerBackTitle: "Atrás",
            headerRight: () => (
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("CreateReport")}
              >
                <Text style={styles.buttonText}>Agregar</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="DetalleUserService"
          component={InfoDetailsScreen}
          options={{
            headerShown: true,
            headerTitle: "Personas de servicios",
            headerBackTitle: "Atrás",
          }}
        />
        <Stack.Screen
          name="Promociones"
          component={PromoCreen}
          options={{
            headerShown: true,
            headerTitle: "Promociones",
            headerBackTitle: "Atrás",
          }}
        />
        <Stack.Screen
          name="Posts"
          component={PostsScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: "Publicaciones",
            headerBackTitle: "Atrás",
            headerRight: () => (
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("CreatePost")}
              >
                <Text style={styles.buttonText}>Conectate</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="DetallePlanActivo"
          component={DetallePlanActivo}
          options={{
            headerShown: true,
            headerTitle: "Detalle Saldo",
            headerBackTitle: "Atrás",
            // headerStyle: { backgroundColor: "#F0F0F0" },
            // headerTintColor: "black",
            // headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePost}
          options={{
            headerShown: true,
            headerTitle: "Crear publicación",
            headerBackTitle: "Atrás",
          }} // Mostrar un botón de regreso 007BFF
        />
        <Stack.Screen
          name="CreateReport"
          component={AddReportScreen}
          options={{
            headerShown: true,
            headerTitle: "Agregar reporte",
            headerBackTitle: "Atrás",
          }} // Mostrar un botón de regreso 007BFF
        />
        <Stack.Screen
          name="FormularioInvitacion"
          component={FormularioInvitacion}
          options={{
            headerShown: true,
            headerTitle: "Afiliar",
            headerBackTitle: "Atrás",
          }} // Mostrar un botón de regreso 007BFF
        />
        <Stack.Screen
          name="Perfil"
          component={UserProfile}
          options={() => ({
            headerShown: true,
            headerTitle: "Perfil",
            headerBackTitle: "Atrás",
          })}
        />
        <Stack.Screen
          name="SolicitudServicio"
          component={SolicitudServicio}
          options={() => ({
            headerShown: true,
            headerTitle: "Solicitud de servicio",
            headerBackTitle: "Atrás",
          })}
        />
        <Stack.Screen name="News" component={NewsListScreen} options={() => ({
            headerShown: true,
            headerTitle: "Noticias",
            headerBackTitle: "Atrás",
          })}
        />
        <Stack.Screen name="NewsDetail" component={NewsDetailScreen} options={() => ({
            headerShown: true,
            headerTitle: "Detalles",
            headerBackTitle: "Atrás",
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    // borderColor: Colors.textPrimary,
    backgroundColor: Colors.textColor,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 20,

    // Propiedades de sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Elevación para Android
    elevation: 5,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 10,
  },
  buttonTextRegister: {
    color: "#fff",
    fontSize: 18,
    marginRight: 15,
  },
  bordeContainer: {
    width: 120,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  imagen: {
    width: "100%",
    height: "100%",
    // borderWidth: 2, // Grosor del borde
    // borderColor: "white", // Color del borde
    resizeMode: "contain", // La imagen se ajusta sin deformarse
  },
});
