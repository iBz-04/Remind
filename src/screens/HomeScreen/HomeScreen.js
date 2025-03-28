import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Platform, Alert, Modal, Animated, Dimensions, Image, ScrollView } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc, updateDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import styles from './styles';
import LoadingModal from '../../utils/LoadingModal';
import CustomCalendar from '../../components/CustomCalendar';
import CustomTimePicker from '../../components/CustomTimePicker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen(props) {
    const [reminderText, setReminderText] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingReminder, setEditingReminder] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const slideAnim = useState(new Animated.Value(-300))[0];
    const [importance, setImportance] = useState(2);
    const [streakCount, setStreakCount] = useState(0);
    const [totalStudyDays, setTotalStudyDays] = useState(0);
    const [monthlyProgress, setMonthlyProgress] = useState(0);

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

    useEffect(() => {
        recordDailyUsage();
        fetchActivitySummary();
    }, []);

    const formatDateTime = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    const handleConfirm = (date) => {
        setDatePickerVisible(false);
        setSelectedDate(date);
    };

    const onAddReminderPress = async () => {
        if (reminderText.length === 0) {
            alert('Please enter what you need to study');
            return;
        }

        if (selectedDate < new Date()) {
            alert('Please select a future date and time');
            return;
        }

            setLoading(true); 
            try {
                const data = {
                text: reminderText,
                reminderTime: selectedDate.toISOString(),
                userID: userID,
                    createdAt: serverTimestamp(),
                completed: false,
                importance: importance
            };
            await addDoc(remindersRef, data);
            setReminderText('');
            setSelectedDate(new Date());
            setImportance(2);
            } catch (error) {
                alert(error.message);
            } finally {
                setLoading(false); 
            }
    };

    const onLogoutPress = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(error);
        }
    };

    const onDeleteReminder = (reminderId) => {
        Alert.alert(
            "Delete Reminder",
            "Are you sure you want to delete this reminder?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await deleteDoc(doc(db, 'reminders', reminderId));
                        } catch (error) {
                            alert(error.message);
                        } finally {
                            setLoading(false);
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const onEditReminder = (reminder) => {
        setEditingReminder(reminder);
        setReminderText(reminder.text);
        setSelectedDate(new Date(reminder.reminderTime));
    };

    const onUpdateReminder = async () => {
        if (!editingReminder) return;

        if (reminderText.length === 0) {
            alert('Please enter what you need to study');
            return;
        }

        if (selectedDate < new Date()) {
            alert('Please select a future date and time');
            return;
        }

        setLoading(true);
        try {
            await updateDoc(doc(db, 'reminders', editingReminder.id), {
                text: reminderText,
                reminderTime: selectedDate.toISOString(),
                updatedAt: serverTimestamp()
            });
            setEditingReminder(null);
            setReminderText('');
            setSelectedDate(new Date());
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
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

    const renderImportanceSelector = () => {
        return (
            <View style={styles.importanceContainer}>
                <Text style={styles.importanceLabel}>Importance Level:</Text>
                <View style={styles.importanceButtons}>
                    <TouchableOpacity 
                        style={[
                            styles.importanceButton,
                            importance === 3 && styles.importanceButtonActive,
                            { backgroundColor: importance === 3 ? '#ffe5e5' : '#fff' }
                        ]}
                        onPress={() => setImportance(3)}
                    >
                        <Text style={[
                            styles.importanceButtonText,
                            importance === 3 && { color: '#ff6b6b' }
                        ]}>
                            High
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.importanceButton,
                            importance === 2 && styles.importanceButtonActive,
                            { backgroundColor: importance === 2 ? '#eef0ff' : '#fff' }
                        ]}
                        onPress={() => setImportance(2)}
                    >
                        <Text style={[
                            styles.importanceButtonText,
                            importance === 2 && { color: '#5b6af5' }
                        ]}>
                            Medium
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[
                            styles.importanceButton,
                            importance === 1 && styles.importanceButtonActive,
                            { backgroundColor: importance === 1 ? '#e8f5e9' : '#fff' }
                        ]}
                        onPress={() => setImportance(1)}
                    >
                        <Text style={[
                            styles.importanceButtonText,
                            importance === 1 && { color: '#4CAF50' }
                        ]}>
                            Low
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderReminder = ({ item }) => {
        const reminderDate = new Date(item.reminderTime);
        return (
            <View key={item.id} style={styles.reminderContainer}>
                <View style={styles.reminderContent}>
                    <View style={styles.reminderTimeContainer}>
                        <Text style={styles.reminderDay}>
                            {reminderDate.toLocaleDateString([], { weekday: 'short' })}
                        </Text>
                        <Text style={styles.reminderDate}>
                            {reminderDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </Text>
                        <Text style={styles.reminderTime}>
                            {reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                    <Text style={styles.reminderText}>{item.text}</Text>
                    <View style={styles.reminderActions}>
                        <TouchableOpacity 
                            style={styles.editButton}
                            onPress={() => onEditReminder(item)}
                        >
                            <Ionicons name="pencil" size={18} color="#5b6af5" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.deleteButton}
                            onPress={() => onDeleteReminder(item.id)}
                        >
                            <Ionicons name="trash-outline" size={18} color="#ff6b6b" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

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

    const fetchActivitySummary = async () => {
        try {
            const remindersRef = collection(db, 'reminders');
            const q = query(
                remindersRef,
                where("userID", "==", userID),
            );
            
            const querySnapshot = await getDocs(q);
            const studyDaysMap = {};
            
            querySnapshot.forEach(doc => {
                const reminder = doc.data();
                if (reminder.completed && reminder.completedAt) {  
                    const completionDate = new Date(reminder.completedAt);
                    const dateString = completionDate.toISOString().split('T')[0];
                    studyDaysMap[dateString] = true;
                }
            });
            
            
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            studyDaysMap[todayString] = true;
            
            const streak = calculateStreak(studyDaysMap);
            const total = Object.keys(studyDaysMap).length;
            
            setStreakCount(streak);
            setTotalStudyDays(total);
            setMonthlyProgress(calculateMonthlyProgress(studyDaysMap));
        } catch (error) {
            console.error("Error fetching activity:", error);
        }
    };

    const renderGreeting = () => {
        const hours = new Date().getHours();
        let greeting = "Good morning";
        
        if (hours >= 12 && hours < 17) {
            greeting = "Good afternoon";
        } else if (hours >= 17) {
            greeting = "Good evening";
        }

        return (
            <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>
                    {greeting}, {props.extraData.fullName.split(' ')[0]} 👋
                </Text>
                <Text style={styles.greetingSubtext}>
                    Ready to plan your study session? Let's make it count!
                </Text>
            </View>
        );
    };

    const recordDailyUsage = async () => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayString = today.toISOString().split('T')[0];
            
           
            const usageRef = collection(db, 'appUsage');
            const q = query(
                usageRef,
                where("userID", "==", userID),
                where("date", "==", todayString)
            );
            
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
               
                await addDoc(usageRef, {
                    userID,
                    date: todayString,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error("Error recording app usage:", error);
        }
    };

    const renderActivityOverview = () => (
        <View style={styles.activityOverviewContainer}>
            <View style={styles.summaryHeader}>
                <View>
                    <Text style={styles.summaryTitle}>Activity Overview</Text>
                    <Text style={styles.summarySubtitle}>Your study progress</Text>
                </View>
                <TouchableOpacity 
                    style={styles.viewAllButton}
                    onPress={() => props.navigation.navigate('Activity')}
                >
                    <Text style={styles.viewAllText}>View Details</Text>
                    <MaterialIcons name="chevron-right" size={16} color="#5b6af5" />
                </TouchableOpacity>
            </View>
            <View style={styles.statsRow}>
                <View style={[styles.statItem, styles.statItemStreak]}>
                    <View style={styles.statIconContainer}>
                        <MaterialIcons name="local-fire-department" size={24} color="#ff6b6b" />
                    </View>
                    <Text style={styles.statNumber}>{streakCount}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={[styles.statItem, styles.statItemTotal]}>
                    <View style={styles.statIconContainer}>
                        <MaterialIcons name="calendar-today" size={24} color="#4CAF50" />
                    </View>
                    <Text style={styles.statNumber}>{totalStudyDays}</Text>
                    <Text style={styles.statLabel}>Total Days</Text>
                </View>
                <View style={[styles.statItem, styles.statItemProgress]}>
                    <View style={styles.statIconContainer}>
                        <MaterialIcons name="trending-up" size={24} color="#5b6af5" />
                    </View>
                    <Text style={styles.statNumber}>{monthlyProgress}%</Text>
                    <Text style={styles.statLabel}>Monthly Goal</Text>
                </View>
            </View>
        </View>
    );

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
                <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
                    <MaterialIcons name="logout" size={24} color="#ff6b6b" />
                </TouchableOpacity>
            </View>

            <ScrollView 
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {renderGreeting()}

                {renderActivityOverview()}

                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <MaterialIcons 
                            name="edit" 
                            size={24} 
                            color="#5b6af5" 
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="What do you need to study?"
                            value={reminderText}
                            onChangeText={setReminderText}
                            placeholderTextColor="#aaaaaa"
                            multiline={true}
                        />
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.datePickerButton} 
                        onPress={() => setDatePickerVisible(true)}
                    >
                        <MaterialIcons 
                            name="schedule" 
                            size={24} 
                            color="#5b6af5" 
                            style={styles.datePickerIcon}
                        />
                        <View style={styles.datePickerContent}>
                            <Text style={styles.datePickerLabel}>Scheduled for</Text>
                            <Text style={styles.datePickerButtonText}>
                                {formatDateTime(selectedDate)}
                            </Text>
                        </View>
                        <MaterialIcons 
                            name="chevron-right" 
                            size={24} 
                            color="#666"
                        />
                    </TouchableOpacity>

                    <Modal
                        visible={isDatePickerVisible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setDatePickerVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.calendarModalContainer}>
                                <View style={styles.calendarHeader}>
                                    <Text style={styles.calendarTitle}>Select Date & Time</Text>
                                    <TouchableOpacity 
                                        onPress={() => setDatePickerVisible(false)}
                                        style={styles.closeButton}
                                    >
                                        <Text style={styles.closeButtonText}>✕</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.calendarAndTimeContainer}>
                                    <CustomCalendar
                                        selectedDate={selectedDate}
                                        onDateSelect={(date) => {
                                            const newDate = new Date(selectedDate);
                                            newDate.setFullYear(date.getFullYear());
                                            newDate.setMonth(date.getMonth());
                                            newDate.setDate(date.getDate());
                                            setSelectedDate(newDate);
                                        }}
                                    />

                                    <View style={styles.timePickerContainer}>
                                        <Text style={styles.timePickerLabel}>Select Time</Text>
                                        <CustomTimePicker
                                            selectedTime={selectedDate}
                                            onTimeSelect={(date) => setSelectedDate(date)}
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.confirmDateButton}
                                    onPress={() => setDatePickerVisible(false)}
                                >
                                    <Text style={styles.confirmDateButtonText}>Confirm Selection</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {renderImportanceSelector()}

                    <TouchableOpacity 
                        style={[styles.addButton, editingReminder && styles.updateButton]} 
                        onPress={editingReminder ? onUpdateReminder : onAddReminderPress}
                    >
                        <Text style={styles.buttonText}>
                            {editingReminder ? 'Update Reminder' : 'Add Reminder'}
                        </Text>
                    </TouchableOpacity>

                    {editingReminder && (
                        <TouchableOpacity 
                            style={styles.cancelButton} 
                            onPress={() => {
                                setEditingReminder(null);
                                setReminderText('');
                                setSelectedDate(new Date());
                            }}
                        >
                            <Text style={styles.buttonText}>Cancel Edit</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {reminders.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No study reminders yet</Text>
                        <Text style={styles.emptySubText}>Add your first study reminder above</Text>
                    </View>
                ) : (
                <View style={styles.listContainer}>
                        {reminders.map(reminder => (
                            <View key={reminder.id}>
                                {renderReminder({ item: reminder })}
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
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
                        onPress={() => props.navigation.navigate('Activity')}
                    >
                        <MaterialIcons name="trending-up" size={24} color="#5b6af5" />
                        <Text style={styles.sidebarItemText}>Activity</Text>
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
            
            <LoadingModal isVisible={loading} /> 
        </View>
    );
}