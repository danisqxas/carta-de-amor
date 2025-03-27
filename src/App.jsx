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

  const renderCard = (card, index) => {
    const scale = scrollX.interpolate({
      inputRange: inputRanges[index],
      outputRange: [0.8, 1, 0.8],
      extrapolate: "clamp"
    });

    return (
      <TouchableOpacity key={card.id} activeOpacity={0.8}>
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          <ImageBackground 
            source={{ uri: card.image }} 
            style={styles.cardImage}
            imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.gradient}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTag}>
                  <Text style={styles.cardTagText}>Featured</Text>
                </View>
                <TouchableOpacity style={styles.favoriteButton}>
                  <MaterialIcons name="favorite-border" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ImageBackground>
          
          <View style={styles.cardContent}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{card.rating}</Text>
              </View>
            </View>
            
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={16} color="#FF385C" />
              <Text style={styles.locationText}>{card.location}</Text>
            </View>
            
            <Text style={styles.cardDescription}>{card.description}</Text>
            
            <View style={styles.amenitiesContainer}>
              {card.amenities.map((amenity, idx) => (
                <View key={idx} style={styles.amenityTag}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.cardFooter}>
              <Text style={styles.priceText}>{card.price}<Text style={styles.perNight}> / night</Text></Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity style={styles.profileButton}>
          <FontAwesome5 name="user-circle" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search destinations</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {['All', 'Popular', 'Recommended', 'Trending', 'Luxury'].map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.categoryButton, index === 0 && styles.activeCategoryButton]}
            >
              <Text style={[styles.categoryText, index === 0 && styles.activeCategoryText]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <Text style={styles.sectionTitle}>Featured Destinations</Text>
      
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {cards.map((card, index) => renderCard(card, index))}
      </Animated.ScrollView>
      
      <View style={styles.paginationContainer}>
        {cards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              Math.floor(scrollX._value / CARD_WIDTH + 0.5) === index && styles.paginationDotActive
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
  // (resto de los estilos son los mismos que proporcionaste)
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
