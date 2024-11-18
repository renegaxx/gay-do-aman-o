import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator, TextInput, Animated } from 'react-native';
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const UsuariosConversas = () => {
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [activeTab, setActiveTab] = useState('Todos');
    const db = getFirestore();
    const auth = getAuth();

    // Criar um objeto de animação para cada ícone de favorito
    const favoriteAnimations = useRef({}).current;

    const fetchAddedUsers = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUsers(userData.addedUsers || []);
            }
        } catch (error) {
            console.error('Erro ao carregar usuários adicionados:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddedUsers();
    }, []);

    const toggleFavorite = async (userId) => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const userDocRef = doc(db, 'users', currentUser.uid);

        if (favorites.includes(userId)) {
            setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== userId));
            try {
                await updateDoc(userDocRef, {
                    favorites: arrayRemove(userId),
                });
            } catch (error) {
                console.error('Erro ao remover favorito:', error);
            }
        } else {
            setFavorites((prevFavorites) => [...prevFavorites, userId]);
            try {
                await updateDoc(userDocRef, {
                    favorites: arrayUnion(userId),
                });
            } catch (error) {
                console.error('Erro ao adicionar favorito:', error);
            }
        }

        animateFavorite(userId);
    };

    const animateFavorite = (userId) => {
        if (!favoriteAnimations[userId]) {
            favoriteAnimations[userId] = new Animated.Value(0);
        }
        const animation = favoriteAnimations[userId];

        animation.setValue(0);
        Animated.sequence([
            Animated.timing(animation, {
                toValue: 1,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(animation, {
                toValue: -1,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(animation, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const formatMessage = (message) => {
        if (!message) return '';
        const words = message.split(' ');
        return words.length > 13 ? words.slice(0, 13).join(' ') + '...' : message;
    };

    const filteredUsers = activeTab === 'Favoritos'
        ? users.filter((user) => favorites.includes(user.id))
        : users;

    const renderUserItem = ({ item }) => {
        const isFavorite = favorites.includes(item.id);
        const animation = favoriteAnimations[item.id] || new Animated.Value(0);

        return (
            <TouchableOpacity onPress={() => openChat(item.id)} style={styles.userItem}>
                <View style={styles.tudoUsuarios}>
                    <Image source={require('./assets/mcigPerfil.jpg')} style={styles.perfil1} />
                    <View style={styles.textConteudo}>
                        <Text style={styles.userText}>
                            {item.username || 'Usuário desconhecido'}
                        </Text>
                        <Text style={styles.lastMessageText}>
                            {formatMessage(item.lastMessage || 'Aperte para conversar')}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => toggleFavorite(item.id)}
                        style={styles.favoriteButton}
                    >
                        <Animated.Text
                            style={{
                                color: isFavorite ? '#FFD700' : '#A1A0A0',
                                transform: [{ translateX: animation }],
                            }}
                        >
                            ★
                        </Animated.Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const openChat = (otherUserId) => {
        navigation.navigate('MessagesScreen', { userId: otherUserId });
    };

    const handleNavigation = (screen, tab) => {
        setActiveTab(tab);
        navigation.navigate(screen);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.topo}>
                    <TextInput
                        style={styles.input}
                        placeholder="Pesquisar conversas"
                        placeholderTextColor="#A1A0A0"
                    />
                    <TouchableOpacity style={styles.searchButton}>
                        <Image
                            source={require('./assets/icons/pesquisarImg.png')}
                            style={styles.searchIcon}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.tabContainer}>
                    <TouchableOpacity onPress={() => handleNavigation('UsuariosConversas', 'Todos')}>
                        <Text style={[styles.tabText, activeTab === 'Todos' && styles.activeTab]}>
                            Todos
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNavigation('UsuariosConversas', 'Favoritos')}>
                        <Text
                            style={[styles.tabText, activeTab === 'Favoritos' && styles.activeTab]}
                        >
                            Favoritos
                        </Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#9F3EFC" />
                ) : (
                    <FlatList
                        data={filteredUsers}
                        keyExtractor={(item) => item.id}
                        renderItem={renderUserItem}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Não há usuários disponíveis.</Text>
                        }
                    />
                )}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('PesquisarScreen')}>
                    <Image
                        source={require('./assets/icons/pesquisarImg.png')}
                        style={styles.footerIcon}
                    />
                </TouchableOpacity>
                <Image source={require('./assets/icons/slaImg.png')} style={styles.footerIcon} />
                <TouchableOpacity onPress={() => navigation.navigate('TelaInicial')}>
                    <Image
                        source={require('./assets/icons/homeImg.png')}
                        style={styles.footerIcon}
                    />
                </TouchableOpacity>
                <Image
                    source={require('./assets/icons/notificationImg.png')}
                    style={styles.footerIcon}
                />
                <TouchableOpacity onPress={() => navigation.navigate('UsuariosConversas')}>
                    <Image
                        source={require('./assets/icons/messageImg.png')}
                        style={styles.footerIcon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#000',
    },
    topo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#1a1a1a',
        color: 'white',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 30,
        fontSize: 16,
        flex: 1,
    },
    searchButton: {
        marginLeft: 10,
    },
    searchIcon: {
        width: 25,
        height: 25,
        tintColor: '#A1A0A0',
    },
    tudoUsuarios: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    perfil1: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    textConteudo: {
        flex: 1,
    },
    userText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    lastMessageText: {
        fontSize: 14,
        color: '#A1A0A0',
        marginTop: 4,
    },
    favoriteButton: {
        padding: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 15,
    },
    tabText: {
        fontSize: 16,
        color: '#A1A0A0',
    },
    activeTab: {
        color: '#9F3EFC',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#1a1a1a',
        paddingVertical: 10,
    },
    footerIcon: {
        width: 30,
        height: 30,
        tintColor: '#9F3EFC',
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: '#A1A0A0',
        marginTop: 20,
        fontSize: 16,
    },
});

export default UsuariosConversas;