import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  Animated,
  StatusBar,
  ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

export default function HomeScreen() {
  const [activeCard, setActiveCard] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const cards = [
    {
      id: 1,
      title: 'Mountain Retreat',
      description: 'Experience the breathtaking views at our exclusive mountain resort.',
      image: 'https://api.a0.dev/assets/image?text=mountain%20retreat%20luxury%20resort%20with%20snow%20capped%20peaks&aspect=16:9',
      rating: 4.9,
      price: '$299',
      location: 'Swiss Alps',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant']
    },
    {
      id: 2,
      title: 'Beach Paradise',
      description: 'Relax and unwind at our beachfront villa with crystal clear waters.',
      image: 'https://api.a0.dev/assets/image?text=luxury%20beach%20resort%20with%20clear%20turquoise%20water&aspect=16:9',
      rating: 4.8,
      price: '$349',
      location: 'Maldives',
      amenities: ['WiFi', 'Pool', 'Bar', 'Water Sports']
    },
    {
      id: 3,
      title: 'Urban Getaway',
      description: 'Stay in the heart of the city with access to shopping and nightlife.',
      image: 'https://api.a0.dev/assets/image?text=modern%20city%20hotel%20with%20skyline%20view%20at%20night&aspect=16:9',
      rating: 4.7,
      price: '$249',
      location: 'New York',
      amenities: ['WiFi', 'Gym', 'Restaurant', 'Concierge']
    },
  ];

  const getInputRange = (index) => [
    (index - 1) * CARD_WIDTH,
    index * CARD_WIDTH,
    (index + 1) * CARD_WIDTH
  ];

  const renderCard = (card, index) => {
    const inputRange = getInputRange(index);
    
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });
    
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity 
        key={card.id}
        activeOpacity={0.9}
        onPress={() => console.log(`Selected ${card.title}`)}
      >
        <Animated.View style={[
          styles.card,
          {
            transform: [{ scale }],
            opacity,
          }
        ]}>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FF385C',
    borderRadius: 25,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF385C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesScroll: {
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  activeCategoryButton: {
    backgroundColor: '#FF385C',
  },
  categoryText: {
    color: '#666',
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: width * 0.05,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  cardImage: {
    height: 200,
    justifyContent: 'flex-end',
  },
  gradient: {
    height: '100%',
    justifyContent: 'space-between',
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTag: {
    backgroundColor: 'rgba(255, 56, 92, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  cardTagText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 15,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: '#333',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  cardDescription: {
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  amenityTag: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    color: '#666',
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  perNight: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'normal',
  },
  bookButton: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: '#FF385C',
  }
});
