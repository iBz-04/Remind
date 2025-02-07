import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import { auth, db } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onFooterLinkPress = () => {
        navigation.navigate('Registration');
    }

    const onLoginPress = async () => {
        try {
            setIsLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            
            const userDoc = await getDoc(doc(db, 'users', uid));
            
            if (!userDoc.exists()) {
                alert("User does not exist anymore.");
                return;
            }
            const userData = userDoc.data();
            await AsyncStorage.setItem('user', JSON.stringify(userData));  // Save user data
            navigation.navigate('Home', {user: userData});
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={styles.scrollContainer}
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps="always"
                bounces={false}
                overScrollMode="never">
                <SafeAreaView style={styles.headerContainer}>
                    <Image
                        style={styles.logo}
                        source={require('../../../assets/icon.png')}
                    />
                    <Text style={styles.welcomeText}>Welcome Back!</Text>
                    <Text style={styles.subtitleText}>Sign in to continue your study journey</Text>
                </SafeAreaView>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="email" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder='Email'
                            placeholderTextColor="#aaaaaa"
                            onChangeText={setEmail}
                            value={email}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#aaaaaa"
                            secureTextEntry={!showPassword}
                            placeholder='Password'
                            onChangeText={setPassword}
                            value={password}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity 
                            onPress={() => setShowPassword(!showPassword)}
                            style={styles.passwordIcon}
                        >
                            <MaterialIcons 
                                name={showPassword ? "visibility" : "visibility-off"} 
                                size={20} 
                                color="#666" 
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={onLoginPress}
                        disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonTitle}>Log in</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footerView}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={onFooterLinkPress}>
                            <Text style={styles.footerLink}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}

// Namespace SDK
// const onLoginPress = () => {
//     firebase
//         .auth()
//         .signInWithEmailAndPassword(email, password)
//         .then((response) => {
//             const uid = response.user.uid
//             const usersRef = firebase.firestore().collection('users')
//             usersRef
//                 .doc(uid)
//                 .get()
//                 .then(firestoreDocument => {
//                     if (!firestoreDocument.exists) {
//                         alert("User does not exist anymore.")
//                         return;
//                     }
//                     const user = firestoreDocument.data()
//                     navigation.navigate('Home', {user})
//                 })
//                 .catch(error => {
//                     alert(error)
//                 });
//         })
//         .catch(error => {
//             alert(error)
//         })
// }