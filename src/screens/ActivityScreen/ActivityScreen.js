import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './styles';
import sarcasticMotivations from '../../data/sarcasticMotivations';

export default function ActivityScreen(props) {
    const [isSidebarOpen, setSidebarOpen] = React.useState(false);
    const slideAnim = React.useState(new Animated.Value(-300))[0];
    const [studyDays, setStudyDays] = useState({});
    const [currentMonth] = useState(new Date().getMonth());
    const [currentYear] = useState(new Date().getFullYear());
    const [streakCount, setStreakCount] = useState(0);
    const [totalStudyDays, setTotalStudyDays] = useState(0);

    useEffect(() => {
        fetchStudyActivity();
        
        // Add navigation listener to refresh data when screen is focused
        const unsubscribe = props.navigation.addListener('focus', () => {
            fetchStudyActivity();
        });

        return unsubscribe;
    }, []);

    const calculateStreak = (studyDaysMap) => {
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        // Start counting from today
        while (studyDaysMap[currentDate.toISOString().split('T')[0]]) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        return streak;
    };

    const fetchStudyActivity = async () => {
        try {
            const remindersRef = collection(db, 'reminders');
            const q = query(
                remindersRef,
                where("userID", "==", props.extraData.id),
            );
            
            const querySnapshot = await getDocs(q);
            const studyDaysMap = {};
            
            querySnapshot.forEach(doc => {
                const reminder = doc.data();
                if (reminder.completed && reminder.completedAt) {  // Only count completed reminders with completedAt
                    const completionDate = new Date(reminder.completedAt);
                    const dateString = completionDate.toISOString().split('T')[0];
                    studyDaysMap[dateString] = true;
                }
            });
            
            // Also mark today as a study day since user opened the app
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            studyDaysMap[todayString] = true;
            
            const streak = calculateStreak(studyDaysMap);
            const total = Object.keys(studyDaysMap).length;
            
            setStreakCount(streak);
            setTotalStudyDays(total);
            setStudyDays(studyDaysMap);
        } catch (error) {
            console.error("Error fetching activity:", error);
        }
    };

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const renderActivityDay = ({ item }) => {
        const date = new Date(currentYear, currentMonth, item);
        const dateKey = date.toISOString().split('T')[0];
        const hasStudied = studyDays[dateKey];
        const isToday = new Date().toDateString() === date.toDateString();
        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

        return (
            <View style={[
                styles.activityDay,
                hasStudied && styles.studiedDay,
                isToday && styles.today,
                !isPast && styles.futureDay
            ]}>
                <Text style={[
                    styles.activityDayText,
                    hasStudied && styles.studiedDayText,
                    isToday && styles.todayText
                ]}>
                    {item}
                </Text>
                {hasStudied && (
                    <MaterialIcons 
                        name="check-circle" 
                        size={16} 
                        color="#4CAF50" 
                        style={styles.checkIcon}
                    />
                )}
            </View>
        );
    };

    const renderStats = () => {
        return (
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { marginRight: 12 }]}>
                    <MaterialIcons name="local-fire-department" size={24} color="#ff6b6b" />
                    <Text style={styles.statNumber}>{streakCount}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statCard}>
                    <MaterialIcons name="calendar-today" size={24} color="#5b6af5" />
                    <Text style={styles.statNumber}>{totalStudyDays}</Text>
                    <Text style={styles.statLabel}>Total Study Days</Text>
                </View>
            </View>
        );
    };

    const renderMotivationalMessage = () => {
        // Use today's day of the month to select a message
        const today = new Date().getDate(); // 1 to 31
        const index = today % sarcasticMotivations.length;
        const message = sarcasticMotivations[index];

        return (
            <View style={styles.motivationalContainer}>
                <Text style={styles.motivationalText}>{message}</Text>
            </View>
        );
    };

    const toggleSidebar = () => {
        const toValue = isSidebarOpen ? -300 : 0;
        Animated.spring(slideAnim, {
            toValue,
            useNativeDriver: true,
            speed: 15,
            bounciness: 5,
        }).start();
        setSidebarOpen(!isSidebarOpen);
    };

    const navigateToHome = () => {
        if (props.navigation) {
            props.navigation.navigate('Home');
        }
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
                <TouchableOpacity style={styles.logoutButton} onPress={props.onLogoutPress}>
                    <MaterialIcons name="logout" size={24} color="#ff6b6b" />
                </TouchableOpacity>
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
                            source={require('../../../assets/icon.png')}
                            style={styles.logoImage}
                        />
                        <Text style={styles.sidebarTitle}>Menu</Text>
                    </View>
                    <TouchableOpacity onPress={toggleSidebar}>
                        <MaterialIcons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.sidebarContent}>
                    <TouchableOpacity 
                        style={styles.sidebarItem}
                        onPress={navigateToHome}
                    >
                        <MaterialIcons name="home" size={24} color="#5b6af5" />
                        <Text style={styles.sidebarItemText}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.sidebarItem}
                        onPress={() => props.navigation && props.navigation.navigate('Reminders')}
                    >
                        <MaterialIcons name="notifications" size={24} color="#5b6af5" />
                        <Text style={styles.sidebarItemText}>Reminders</Text>
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
                        onPress={props.onLogoutPress}
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

            <View style={styles.content}>
                <Text style={styles.title}>Study Activity</Text>
                {renderMotivationalMessage()}
                {renderStats()}
                
                <Text style={styles.subtitle}>Your Study Calendar</Text>
                <View style={styles.activityContainer}>
                    <FlatList
                        data={[...Array(getDaysInMonth(currentMonth, currentYear)).keys()].map(i => i + 1)}
                        renderItem={renderActivityDay}
                        keyExtractor={item => item.toString()}
                        numColumns={7}
                        style={styles.activityGrid}
                    />
                </View>
            </View>
        </View>
    );
} 