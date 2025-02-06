import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomCalendar = ({ onDateSelect, selectedDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const currentYear = new Date().getFullYear();
    
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const calendarDays = [];
        // Add empty slots for the leading days of the week.
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDays.push(<View key={`empty-${i}`} style={styles.dayButton} />);
        }
    
        // Create day buttons for each day in the month.
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            date.setHours(0, 0, 0, 0);
            const isPast = date < today; // true if strictly before today
            const isToday = date.getTime() === today.getTime();
            const isSelected = selectedDate && (new Date(selectedDate)).getTime() === date.getTime();
    
            calendarDays.push(
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.dayButton,
                        isSelected && styles.selectedDay,
                        // Apply past style only if it's truly in the past (not today)
                        isPast && !isToday && styles.pastDay,
                        isToday && styles.today // extra style for today if desired
                    ]}
                    onPress={() => {
                        // Allow selection if the day is today or in the future.
                        if (!isPast || isToday) {
                            onDateSelect(date);
                        }
                    }}
                    // Disable touch if it's in the past and not today.
                    disabled={isPast && !isToday}
                >
                    <Text style={[
                        styles.dayText,
                        isSelected && styles.selectedDayText,
                        isPast && !isToday && styles.pastDayText,
                        isToday && styles.todayText // optional: style current day differently
                    ]}>
                        {day}
                    </Text>
                </TouchableOpacity>
            );
        }
        return calendarDays;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.monthButton}
                    onPress={() => setCurrentMonth(prev => prev > 0 ? prev - 1 : 0)}
                >
                    <Text style={styles.monthButtonText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.monthText}>
                    {months[currentMonth]} {currentYear}
                </Text>
                <TouchableOpacity 
                    style={styles.monthButton}
                    onPress={() => setCurrentMonth(prev => prev < 11 ? prev + 1 : 11)}
                >
                    <Text style={styles.monthButtonText}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.weekDays}>
                {[
                    { key: 'sun', label: 'S' },
                    { key: 'mon', label: 'M' },
                    { key: 'tue', label: 'T' },
                    { key: 'wed', label: 'W' },
                    { key: 'thu', label: 'T' },
                    { key: 'fri', label: 'F' },
                    { key: 'sat', label: 'S' }
                ].map(day => (
                    <Text key={day.key} style={styles.weekDayText}>
                        {day.label}
                    </Text>
                ))}
            </View>

            <View style={styles.daysContainer}>
                {renderCalendarDays()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    monthButton: {
        padding: 5,
        width: 35,
        alignItems: 'center',
    },
    monthButtonText: {
        fontSize: 28,
        color: '#788eec',
        fontWeight: '300',
    },
    monthText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        width: 120,
        textAlign: 'center',
    },
    weekDays: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        paddingBottom: 5,
    },
    weekDayText: {
        width: 35,
        textAlign: 'center',
        fontSize: 13,
        color: '#999',
        fontWeight: '600',
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    dayButton: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 2,
        marginHorizontal: 5,
    },
    dayText: {
        fontSize: 15,
        color: '#333',
    },
    selectedDay: {
        backgroundColor: '#788eec',
        borderRadius: 17.5,
    },
    selectedDayText: {
        color: '#fff',
        fontWeight: '600',
    },
    today: {
        backgroundColor: '#f0f3ff',
        borderRadius: 17.5,
    },
    todayText: {
        color: '#788eec',
        fontWeight: '600',
    },
    pastDay: {
        opacity: 0.4,
    },
    pastDayText: {
        color: '#999',
    }
});

export default CustomCalendar; 