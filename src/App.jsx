import React from "react";
import { SafeAreaView, StatusBar, View, Text } from "react-native";
import DestinationCarousel from "./components/DestinationCarousel";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <StatusBar barStyle="dark-content" />
      <View>
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          Bienvenido a la App de Destinos
        </Text>
      </View>
      <DestinationCarousel />
    </SafeAreaView>
  );
}
