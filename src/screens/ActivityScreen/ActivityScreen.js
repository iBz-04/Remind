import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './styles';

export default function ActivityScreen(props) {
    const [isSidebarOpen, setSidebarOpen] = React.useState(false);
    const slideAnim = React.useState(new Animated.Value(-300))[0];
    const [studyDays, setStudyDays] = useState({});
    const [currentMonth] = useState(new Date().getMonth());
    const [currentYear] = useState(new Date().getFullYear());
    const [streakCount, setStreakCount] = useState(0);
    const [totalStudyDays, setTotalStudyDays] = useState(0);
    const [monthlyProgress, setMonthlyProgress] = useState(0);

    useEffect(() => {
        fetchStudyActivity();
    }, []);

    const calculateStreak = (studyDaysMap) => {
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        while (studyDaysMap[currentDate.toISOString().split('T')[0]]) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }
        return streak;
    };

    const calculateMonthlyProgress = (studyDaysMap) => {
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const studyDaysThisMonth = Object.keys(studyDaysMap).filter(date => {
            const dateObj = new Date(date);
            return dateObj.getMonth() === today.getMonth() && 
                   dateObj.getFullYear() === today.getFullYear();
        }).length;
        return Math.round((studyDaysThisMonth / daysInMonth) * 100);
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
                if (reminder.reminderTime) {
                    let date;
                    if (reminder.reminderTime.toDate) {
                        date = reminder.reminderTime.toDate();
                    } else if (reminder.reminderTime.seconds) {
                        date = new Date(reminder.reminderTime.seconds * 1000);
                    } else {
                        return;
                    }
                    
                    const dateKey = date.toISOString().split('T')[0];
                    studyDaysMap[dateKey] = true;
                }
            });
            
            setStudyDays(studyDaysMap);
            setStreakCount(calculateStreak(studyDaysMap));
            setTotalStudyDays(Object.keys(studyDaysMap).length);
            setMonthlyProgress(calculateMonthlyProgress(studyDaysMap));
        } catch (error) {
            console.error("Error fetching study activity:", error);
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
                        color="#fff" 
                        style={styles.checkIcon}
                    />
                )}
            </View>
        );
    };

    const renderStats = () => (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <MaterialIcons name="local-fire-department" size={24} color="#ff9800" />
                <Text style={styles.statNumber}>{streakCount}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            
            <View style={styles.statCard}>
                <MaterialIcons name="calendar-today" size={24} color="#4CAF50" />
                <Text style={styles.statNumber}>{totalStudyDays}</Text>
                <Text style={styles.statLabel}>Total Study Days</Text>
            </View>
            
            <View style={styles.statCard}>
                <MaterialIcons name="trending-up" size={24} color="#5b6af5" />
                <Text style={styles.statNumber}>{monthlyProgress}%</Text>
                <Text style={styles.statLabel}>Monthly Goal</Text>
            </View>
        </View>
    );

    const renderMotivationalMessage = () => {
        let message = "";
        if (streakCount > 7) {
            message = "Amazing streak! Keep the momentum going! 🔥";
        } else if (streakCount > 3) {
            message = "You're building a great habit! 💪";
        } else if (streakCount > 0) {
            message = "Great start! Keep it up! ⭐";
        } else {
            message = "Start your study streak today! 📚";
        }
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
        props.navigation.navigate('Home');
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
                        onPress={() => props.navigation.navigate('Reminders')}
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