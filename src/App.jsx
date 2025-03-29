import React, { useRef, useState, useMemo } from "react";
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  ImageBackground 
} from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const SPACING = 20;
const ITEM_WIDTH = CARD_WIDTH + SPACING * 2;

const cards = [
  { 
    id: 1, 
    title: "Luxury Villa", 
    image: "https://via.placeholder.com/150", 
    rating: 4.8,
    location: "Bali, Indonesia", 
    description: "Beautiful villa with stunning ocean views",
    amenities: ["Pool", "WiFi", "Breakfast"],
    price: "$250"
  },
  { 
    id: 2, 
    title: "Mountain Retreat", 
    image: "https://via.placeholder.com/150", 
    rating: 4.5,
    location: "Swiss Alps", 
    description: "Cozy cabin in the mountains",
    amenities: ["Fireplace", "Hot Tub", "Ski Access"],
    price: "$180"
  },
  { 
    id: 3, 
    title: "Urban Loft", 
    image: "https://via.placeholder.com/150", 
    rating: 4.7,
    location: "New York City", 
    description: "Modern loft in the heart of Manhattan",
    amenities: ["City View", "Gym", "Parking"],
    price: "$300"
  }
];

const DestinationCarousel = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        setCurrentIndex(Math.round(offsetX / CARD_WIDTH));
      }
    }
  );

  const inputRanges = useMemo(() =>
    cards.map((_, index) => [(index - 1) * ITEM_WIDTH, index * ITEM_WIDTH, (index + 1) * ITEM_WIDTH]),
    [cards]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity style={styles.profileButton}>
          <FontAwesome5 name="user-circle" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.sectionTitle}>Featured Destinations</Text>
      
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {cards.map((card, index) => {
          const scale = scrollX.interpolate({
            inputRange: inputRanges[index] || [0, 0, 0],
            outputRange: [0.8, 1, 0.8],
            extrapolate: "clamp"
          });
          return (
            <TouchableOpacity key={card.id} activeOpacity={0.8}>
              <Animated.View style={[styles.card, { transform: [{ scale }] }]}> 
                <Image source={{ uri: card.image }} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.priceText}>{card.price} <Text style={styles.perNight}>/ night</Text></Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.paginationContainer}>
        {cards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: '#FF385C'
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default DestinationCarousel;
