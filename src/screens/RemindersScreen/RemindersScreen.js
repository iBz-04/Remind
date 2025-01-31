import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import styles from './styles';
import LoadingModal from '../../utils/LoadingModal';

export default function RemindersScreen(props) {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const slideAnim = useState(new Animated.Value(-300))[0];
    
    const toggleSidebar = () => {
        const toValue = isSidebarOpen ? -300 : 0;
        Animated.timing(slideAnim, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();
        setSidebarOpen(!isSidebarOpen);
    };

    const onLogoutPress = () => {
        auth.signOut();
    };

    const userID = props.extraData.id;
    const remindersRef = collection(db, 'reminders');

    useEffect(() => {
        setLoading(true);
        const q = query(
            remindersRef,
            where("userID", "==", userID),
            orderBy('reminderTime', 'asc')
        );

        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                const newReminders = [];
                querySnapshot.forEach(doc => {
                    const reminder = doc.data();
                    reminder.id = doc.id;
                    newReminders.push(reminder);
                });
                setReminders(newReminders);
                setLoading(false);
            },
            (error) => {
                console.log(error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const renderReminder = ({ item }) => {
        let reminderDate;
        if (item.reminderTime) {
            if (item.reminderTime.toDate) {
                // Handle Firestore Timestamp
                reminderDate = item.reminderTime.toDate();
            } else if (item.reminderTime.seconds) {
                // Handle seconds-based timestamp
                reminderDate = new Date(item.reminderTime.seconds * 1000);
            } else {
                // Handle ISO string
                reminderDate = new Date(item.reminderTime);
            }
        } else {
            reminderDate = new Date(); // Fallback
        }

        const getImportanceStyle = (importance) => {
            switch(importance) {
                case 1:
                    return styles.highImportance;
                case 2:
                    return styles.mediumImportance;
                case 3:
                    return styles.lowImportance;
                default:
                    return styles.mediumImportance;
            }
        };

        const getImportanceLabel = (importance) => {
            switch(importance) {
                case 1:
                    return 'High Priority';
                case 2:
                    return 'Medium Priority';
                case 3:
                    return 'Low Priority';
                default:
                    return 'Medium Priority';
            }
        };

        return (
            <View style={[styles.reminderCard, getImportanceStyle(item.importance)]}>
                <View style={styles.reminderHeader}>
                    <View style={styles.reminderTimeContainer}>
                        <Text style={styles.reminderTime}>
                            {reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        <Text style={styles.reminderDate}>
                            {reminderDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                        </Text>
                    </View>
                    <Text style={[
                        styles.importanceLabel,
                        getImportanceStyle(item.importance)
                    ]}>
                        {getImportanceLabel(item.importance)}
                    </Text>
                </View>
                <Text style={styles.reminderText}>{item.text}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleSidebar}>
                    <MaterialIcons name="menu" size={28} color="#5b6af5" />
                </TouchableOpacity>
                <Image
                    source={require('../../../assets/parrot.png')}
                    style={styles.headerLogo}
                />
            </View>

            <Animated.View style={[
                styles.sidebar,
                {
                    transform: [{ translateX: slideAnim }],
                }
            ]}>
                <View style={styles.sidebarHeader}>
                    <View style={styles.logoContainer}>
                        <Image 
                            source={require('../../../assets/parrot.png')} 
                            style={styles.logoImage}
                        />
                        <Text style={styles.sidebarTitle}>Menu</Text>
                    </View>
                    <TouchableOpacity onPress={toggleSidebar}>
                        <MaterialIcons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <View style={styles.sidebarContent}>
                    <TouchableOpacity 
                        style={styles.sidebarItem}
                        onPress={() => props.navigation.navigate('Home')}
                    >
                        <MaterialIcons name="home" size={24} color="#5b6af5" />
                        <Text style={styles.sidebarItemText}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.sidebarItem}
                        onPress={() => props.navigation.navigate('Activity')}
                    >
                        <MaterialIcons name="trending-up" size={24} color="#5b6af5" />
                        <Text style={styles.sidebarItemText}>Activity</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.sidebarFooter}>
                    <View style={styles.userInfo}>
                        <MaterialIcons name="account-circle" size={40} color="#5b6af5" />
                        <View style={styles.userTextContainer}>
                            <Text style={styles.userName}>{props.extraData.fullName}</Text>
                            <Text style={styles.userEmail}>{props.extraData.email}</Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.logoutMenuItem}
                        onPress={onLogoutPress}
                    >
                        <MaterialIcons name="logout" size={24} color="#ff6b6b" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {isSidebarOpen && (
                <TouchableOpacity 
                    style={styles.overlay} 
                    activeOpacity={1} 
                    onPress={toggleSidebar}
                />
            )}

            {reminders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="notifications-none" size={48} color="#666" />
                    <Text style={styles.emptyText}>No reminders scheduled</Text>
                    <Text style={styles.emptySubText}>Add reminders from the home screen</Text>
                </View>
            ) : (
                <FlatList
                    data={reminders}
                    renderItem={renderReminder}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.remindersList}
                />
            )}
            
            <LoadingModal isVisible={loading} />
        </View>
    );
} 