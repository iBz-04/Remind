import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
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
            orderBy('completed', 'asc'),  
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

    const handleComplete = async (reminderId) => {
        try {
            setLoading(true);
            const reminderRef = doc(db, 'reminders', reminderId);
            await updateDoc(reminderRef, {
                completed: true,
                completedAt: new Date().toISOString()
            });
            
            // Removed navigation refresh logic since onSnapshot handles updates.
            // if (props.navigation) {
            //     props.navigation.navigate('Activity', { refresh: Date.now() });
            //     props.navigation.navigate('Reminders');
            // }
        } catch (error) {
            console.error('Error completing reminder:', error);
            alert('Failed to mark reminder as completed');
        } finally {
            setLoading(false);
        }
    };

    const renderReminder = ({ item }) => {
        const reminderDate = new Date(item.reminderTime);
        
        return (
            <View style={[
                styles.reminderCard,
                item.importance === 3 && styles.highImportance,
                item.importance === 2 && styles.mediumImportance,
                item.importance === 1 && styles.lowImportance,
                item.completed && styles.completedReminder
            ]}>
                <View style={styles.reminderContent}>
                    <View style={styles.reminderHeader}>
                        <View style={styles.timeContainer}>
                            <Text style={styles.reminderTime}>
                                {reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                            <Text style={styles.reminderDate}>
                                {reminderDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                            </Text>
                        </View>
                        <View style={[
                            styles.importanceBadge,
                            item.importance === 3 && styles.highImportanceBadge,
                            item.importance === 2 && styles.mediumImportanceBadge,
                            item.importance === 1 && styles.lowImportanceBadge,
                        ]}>
                            <MaterialIcons 
                                name={item.importance === 3 ? "priority-high" : (item.importance === 2 ? "flag" : "low-priority")} 
                                size={16} 
                                color="#fff" 
                            />
                            <Text style={styles.importanceText}>
                                {item.importance === 3 ? 'High' : (item.importance === 2 ? 'Medium' : 'Low')}
                            </Text>
                        </View>
                    </View>
                    
                    <Text style={styles.reminderText}>{item.text}</Text>
                    
                    {item.completed ? (
                        <View style={styles.completedStatus}>
                            <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                            <Text style={styles.completedText}>Completed</Text>
                        </View>
                    ) : (
                        <TouchableOpacity 
                            onPress={() => handleComplete(item.id)}
                            style={styles.completeButton}
                            activeOpacity={0.8}
                        >
                            <MaterialIcons name="check" size={20} color="#fff" />
                            <Text style={styles.completeButtonText}>Mark as Completed</Text>
                        </TouchableOpacity>
                    )}
                </View>
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
                        onPress={() => props.navigation && props.navigation.navigate('Home')}
                    >
                        <MaterialIcons name="home" size={24} color="#5b6af5" />
                        <Text style={styles.sidebarItemText}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.sidebarItem}
                        onPress={() => props.navigation && props.navigation.navigate('Activity')}
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