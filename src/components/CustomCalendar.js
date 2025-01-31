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
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];
        
        // Add empty spaces for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
        }

        // Add the days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const isSelected = selectedDate && 
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth();
            const isToday = new Date().toDateString() === date.toDateString();
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

            days.push(
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.dayCell,
                        isSelected && styles.selectedDay,
                        isToday && styles.today,
                        isPast && styles.pastDay
                    ]}
                    onPress={() => !isPast && onDateSelect(date)}
                    disabled={isPast}
                >
                    <Text style={[
                        styles.dayText,
                        isSelected && styles.selectedDayText,
                        isToday && styles.todayText,
                        isPast && styles.pastDayText
                    ]}>
                        {day}
                    </Text>
                </TouchableOpacity>
            );
        }

        return days;
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
    dayCell: {
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