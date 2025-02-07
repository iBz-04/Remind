import React from 'react';
import { View, Image, Text, ActivityIndicator } from 'react-native';
import styles from './styles';

export default function LoadScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                />
                <Text style={styles.appName}>StudyTracker</Text>
            </View>
            <ActivityIndicator size="large" color="#5b6af5" />
            <Text style={styles.loadingText}>Loading your study space...</Text>
        </View>
    );
}
