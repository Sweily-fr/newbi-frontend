import React, { useState } from 'react';
import { format, isAfter, isBefore, isEqual, startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, ArrowDown2 } from 'iconsax-react';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  onChange: (range: DateRange) => void;
  initialRange?: DateRange;
  className?: string;
}

/**
 * Composant de sélection de plage de dates
 */
const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onChange,
  initialRange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>(
    initialRange || {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date())
    }
  );
  const [tempRange, setTempRange] = useState<Partial<DateRange>>({});

  // Préréglages de plages de dates
  const presets = [
    { 
      label: 'Aujourd\'hui', 
      range: { 
        startDate: startOfDay(new Date()), 
        endDate: endOfDay(new Date()) 
      } 
    },
    { 
      label: '7 derniers jours', 
      range: { 
        startDate: startOfDay(subDays(new Date(), 6)), 
        endDate: endOfDay(new Date()) 
      } 
    },
    { 
      label: '30 derniers jours', 
      range: { 
        startDate: startOfDay(subDays(new Date(), 29)), 
        endDate: endOfDay(new Date()) 
      } 
    },
    { 
      label: 'Ce mois', 
      range: { 
        startDate: startOfMonth(new Date()), 
        endDate: endOfMonth(new Date()) 
      } 
    },
    { 
      label: 'Mois dernier', 
      range: { 
        startDate: startOfMonth(subMonths(new Date(), 1)), 
        endDate: endOfMonth(subMonths(new Date(), 1)) 
      } 
    },
  ];

  const handleDateClick = (date: Date) => {
    if (!tempRange.startDate) {
      // Premier clic - sélectionner la date de début
      setTempRange({ startDate: date });
    } else {
      // Deuxième clic - sélectionner la date de fin
      if (isBefore(date, tempRange.startDate)) {
        // Si la date sélectionnée est avant la date de début, inverser
        setTempRange({
          startDate: date,
          endDate: tempRange.startDate
        });
      } else {
        setTempRange({
          ...tempRange,
          endDate: date
        });
      }
    }
  };

  const applyRange = () => {
    if (tempRange.startDate && tempRange.endDate) {
      const newRange = {
        startDate: tempRange.startDate,
        endDate: tempRange.endDate
      };
      setSelectedRange(newRange);
      onChange(newRange);
      setIsOpen(false);
      setTempRange({});
    }
  };

  const applyPreset = (preset: DateRange) => {
    setSelectedRange(preset);
    onChange(preset);
    setIsOpen(false);
    setTempRange({});
  };

  const cancelSelection = () => {
    setIsOpen(false);
    setTempRange({});
  };

  const toggleCalendar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTempRange({});
    }
  };

  const isDateInRange = (date: Date) => {
    const start = tempRange.startDate;
    const end = tempRange.endDate;
    
    if (!start) return false;
    if (!end) return isEqual(startOfDay(date), startOfDay(start));
    
    return (
      (isEqual(startOfDay(date), startOfDay(start)) || isAfter(date, start)) &&
      (isEqual(startOfDay(date), startOfDay(end)) || isBefore(date, end))
    );
  };

  const isStartDate = (date: Date) => 
    tempRange.startDate && isEqual(startOfDay(date), startOfDay(tempRange.startDate));

  const isEndDate = (date: Date) => 
    tempRange.endDate && isEqual(startOfDay(date), startOfDay(tempRange.endDate));

  // Générer le calendrier
  const generateCalendar = (baseDate: Date) => {
    const firstDayOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    const lastDayOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
    
    const startDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days = [];
    
    // Jours du mois précédent pour compléter la première semaine
    const prevMonthLastDay = new Date(baseDate.getFullYear(), baseDate.getMonth(), 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      });
    }
    
    // Jours du mois actuel
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(baseDate.getFullYear(), baseDate.getMonth(), i),
        isCurrentMonth: true
      });
    }
    
    // Jours du mois suivant pour compléter la dernière semaine
    const nextMonthDays = 42 - days.length; // 6 semaines * 7 jours = 42
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        date: new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const currentMonth = tempRange.startDate || selectedRange.startDate;
  const calendarDays = generateCalendar(currentMonth);
  
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleCalendar}
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        <div className="flex items-center">
          <Calendar size={18} className="mr-2 text-violet-500" />
          <span>
            {format(selectedRange.startDate, 'dd/MM/yyyy', { locale: fr })} - {format(selectedRange.endDate, 'dd/MM/yyyy', { locale: fr })}
          </span>
        </div>
        <ArrowDown2 size={16} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg w-auto min-w-[700px]">
          <div className="flex">
            {/* Préréglages */}
            <div className="w-1/4 p-3 border-r border-gray-200">
              <h3 className="mb-3 text-sm font-medium text-gray-700">Périodes prédéfinies</h3>
              <div className="space-y-2">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyPreset(preset.range)}
                    className="block w-full px-3 py-2 text-left text-sm rounded-md hover:bg-violet-50 hover:text-violet-700"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendrier */}
            <div className="w-3/4 p-4">
              <div className="grid grid-cols-7 mb-2">
                {weekDays.map((day, index) => (
                  <div key={index} className="text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day.date)}
                    className={`
                      h-8 w-8 rounded-full flex items-center justify-center text-sm
                      ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                      ${isDateInRange(day.date) ? 'bg-violet-100' : ''}
                      ${isStartDate(day.date) ? 'bg-violet-600 text-white' : ''}
                      ${isEndDate(day.date) ? 'bg-violet-600 text-white' : ''}
                      hover:bg-gray-100
                    `}
                  >
                    {day.date.getDate()}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-4 pt-3 border-t border-gray-200">
                <div className="text-sm">
                  {tempRange.startDate && (
                    <span className="font-medium">
                      {format(tempRange.startDate, 'dd/MM/yyyy', { locale: fr })}
                      {tempRange.endDate && ` - ${format(tempRange.endDate, 'dd/MM/yyyy', { locale: fr })}`}
                    </span>
                  )}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={cancelSelection}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={applyRange}
                    disabled={!tempRange.startDate || !tempRange.endDate}
                    className={`
                      px-3 py-1 text-sm rounded-md
                      ${(!tempRange.startDate || !tempRange.endDate)
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-violet-600 text-white hover:bg-violet-700'}
                    `}
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
