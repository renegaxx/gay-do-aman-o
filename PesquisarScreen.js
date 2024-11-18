import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebaseConfig';

const PesquisarScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearchResults([]);

        try {
            const usersRef = collection(db, 'users');
            const q = query(
                usersRef,
                where('username', '>=', searchQuery),
                where('username', '<=', searchQuery + '\uf8ff')
            );
            const querySnapshot = await getDocs(q);

            const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setSearchResults(users);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToUsersList = async (user) => {
        const currentUser = getAuth().currentUser;
        if (!currentUser) return;

        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
                addedUsers: arrayUnion(user),
            });
            alert(`Usuário ${user.username} foi adicionado com sucesso!`);
        } catch (error) {
            console.error("Erro ao adicionar usuário:", error);
            alert("Não foi possível adicionar o usuário. Tente novamente.");
        }
    };

    const renderResultItem = ({ item }) => (
        <View style={styles.userItem}>
            <View style={styles.tudoUsuarios}>
                <Image source={require('./assets/mcigPerfil.jpg')} style={styles.perfil1} />
                <View style={styles.textConteudo}>
                    <Text style={styles.userText}>{item.username}</Text>
                    <Text style={styles.lastMessageText}>{item.fullName}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => addToUsersList(item)}>
                <Image
                    source={require('./assets/icons/adicionarImg.png')}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite o nome do usuário..."
                        placeholderTextColor="#A1A0A0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                        <Image source={require('./assets/icons/pesquisarImg.png')} style={styles.searchIcon} />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#9F3EFC" />
                ) : (
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item) => item.id}
                        renderItem={renderResultItem}
                        ListEmptyComponent={
                            !loading && <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
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
    searchContainer: {
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
    },
    perfil1: {
        width: 53,
        height: 53,
        resizeMode: 'cover',
        borderRadius: 100,
    },
    textConteudo: {
        marginLeft: 10,
    },
    userItem: {
        padding: 13,
        borderRadius: 30,
        marginTop: 10,
        backgroundColor: '#1a1a1a',
        flexDirection: 'row'
    },
    userText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    lastMessageText: {
        color: '#A1A0A0',
        fontSize: 14,
        marginTop: 5,
    },
    addButton: {
        
        borderRadius: 20,
        marginTop: 10,
        alignSelf: 'flex-start',
        marginLeft: 'auto',
    },
    addButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#A1A0A0',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    content: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 10,
    },
    footer: {
        position: 'absolute',  // Posiciona de forma absoluta na tela
        bottom: 0,             // Gruda no rodapé
        width: '100%',         // Largura total da tela
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#1a1a1a', // Fundo escuro
        paddingVertical: 10,       // Espaçamento vertical
    },
    footerIcon: {
        width: 30,                // Largura do ícone
        height: 30,               // Altura do ícone
        tintColor: '#9F3EFC',     // Cor dos ícones (personalizável)
    },
});

export default PesquisarScreen;
